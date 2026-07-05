import cv2
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from detector import detect_objects
from database import upload_image, save_detection, get_history, get_result

app = FastAPI(title="Inventory/Shelf Object Counter API")

# Allow the frontend (running on a different port/domain) to call this API.
# Add your deployed frontend URL here once you deploy to Vercel.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # local Vite dev server
        # "https://your-frontend.vercel.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Object Counter API is running"}


@app.post("/detect")
async def detect(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    original_bytes = await image.read()

    try:
        annotated_image, detections, counts = detect_objects(original_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Encode the annotated (boxed) image back to JPEG bytes for upload
    success, buffer = cv2.imencode(".jpg", annotated_image)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to encode processed image")
    processed_bytes = buffer.tobytes()

    try:
        original_url = upload_image(original_bytes, prefix="original")
        processed_url = upload_image(processed_bytes, prefix="processed")
        saved_row = save_detection(original_url, processed_url, counts, detections)
    except Exception as e:
        # Storage/DB failed — still return the detection result so the frontend
        # isn't blocked, just without a saved history entry.
        raise HTTPException(status_code=502, detail=f"Saved detection failed: {e}")

    return saved_row


@app.get("/history")
def history(limit: int = 50):
    return get_history(limit=limit)


@app.get("/result/{detection_id}")
def result(detection_id: str):
    row = get_result(detection_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Result not found")
    return row