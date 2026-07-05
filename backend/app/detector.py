import cv2
import numpy as np
from collections import Counter

# MobileNet-SSD was trained on the PASCAL VOC dataset — these are its 21 classes.
# Index 0 is "background" and is always ignored.
CLASSES = [
    "background", "aeroplane", "bicycle", "bird", "boat", "bottle",
    "bus", "car", "cat", "chair", "cow", "diningtable", "dog", "horse",
    "motorbike", "person", "pottedplant", "sheep", "sofa", "train", "tvmonitor"
]

CONFIDENCE_THRESHOLD = 0.8

PROTOTXT_PATH = "models/MobileNetSSD_deploy.prototxt"
MODEL_PATH = "models/MobileNetSSD_deploy.caffemodel"

# Load the model once when this module is imported (not on every request — that would be slow).
net = cv2.dnn.readNetFromCaffe(PROTOTXT_PATH, MODEL_PATH)


def detect_objects(image_bytes: bytes):
    """
    Takes raw image bytes (from an uploaded file), runs MobileNet-SSD detection,
    and returns:
      - annotated_image: numpy array (BGR) with boxes drawn on it
      - detections: list of {label, confidence, box}
      - counts: dict of label -> count
    """
    # Decode bytes into an OpenCV image
    np_arr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("Could not decode image. Make sure it's a valid JPG/PNG.")

    (h, w) = image.shape[:2]

    # Convert image into a "blob" the model expects: 300x300, mean-subtracted
    blob = cv2.dnn.blobFromImage(
        cv2.resize(image, (300, 300)),
        scalefactor=0.007843,
        size=(300, 300),
        mean=127.5
    )

    net.setInput(blob)
    raw_detections = net.forward()

    detections = []
    label_counter = Counter()

    # raw_detections shape: [1, 1, N, 7] — loop over each of the N candidate detections
    for i in range(raw_detections.shape[2]):
        confidence = float(raw_detections[0, 0, i, 2])

        if confidence >= CONFIDENCE_THRESHOLD:
            class_id = int(raw_detections[0, 0, i, 1])
            label = CLASSES[class_id] if class_id < len(CLASSES) else "unknown"

            # Box coordinates come back normalized (0-1) — scale to actual image size
            box = raw_detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")

            # Draw the box + label on the image
            cv2.rectangle(image, (startX, startY), (endX, endY), (0, 255, 0), 2)
            text = f"{label}: {confidence * 100:.1f}%"
            y = startY - 10 if startY - 10 > 10 else startY + 20
            cv2.putText(image, text, (startX, y),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

            detections.append({
                "label": label,
                "confidence": round(confidence, 3),
                "box": {
                    "x": int(startX),
                    "y": int(startY),
                    "w": int(endX - startX),
                    "h": int(endY - startY)
                }
            })
            label_counter[label] += 1

    return image, detections, dict(label_counter)