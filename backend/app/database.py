import os
import uuid
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
SUPABASE_BUCKET = os.environ.get("SUPABASE_BUCKET", "detection-images")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def upload_image(image_bytes: bytes, prefix: str) -> str:
    """
    Uploads image bytes to the Supabase Storage bucket and returns a public URL.
    `prefix` is just used to tell original vs processed images apart in storage.
    """
    filename = f"{prefix}-{uuid.uuid4()}.jpg"

    supabase.storage.from_(SUPABASE_BUCKET).upload(
        filename,
        image_bytes,
        {"content-type": "image/jpeg"}
    )

    return supabase.storage.from_(SUPABASE_BUCKET).get_public_url(filename)


def save_detection(original_url: str, processed_url: str, counts: dict, detections: list) -> dict:
    """Inserts one row into the `detections` table and returns the saved row."""
    result = supabase.table("detections").insert({
        "original_image_url": original_url,
        "processed_image_url": processed_url,
        "counts": counts,
        "detections": detections,
    }).execute()

    return result.data[0]


def get_history(limit: int = 50) -> list:
    """Returns most recent detections, newest first."""
    result = (
        supabase.table("detections")
        .select("id, original_image_url, processed_image_url, counts, created_at")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data


def get_result(detection_id: str) -> dict | None:
    """Returns one full detection record by id, or None if not found."""
    result = (
        supabase.table("detections")
        .select("*")
        .eq("id", detection_id)
        .execute()
    )
    return result.data[0] if result.data else None