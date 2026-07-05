# Shelf/Count — Inventory Object Counter

Upload a photo of a shelf, room, or storage area and get back an automatic
count of every object in frame — bottles, boxes, chairs, people — with
bounding boxes, a per-class breakdown, and a bar chart, all saved to a
searchable history.

## Problem statement

Manually counting stock, product, or equipment from photos is slow and
error-prone. This project automates that first pass: point a camera at a
shelf or room, upload the image, and get a structured count back in seconds
instead of a manual tally.

## Features

- Upload a JPG/PNG and detect objects with a pretrained model
- Bounding boxes + confidence scores drawn directly on the image
- Per-class count displayed as inventory-tag style cards
- Bar chart of detected classes
- Every scan saved automatically — searchable history with detail view
- Fully deployed: live frontend + live API

## Tech stack

```
Frontend   React + TypeScript + Tailwind CSS
Backend    FastAPI (Python)
AI model   OpenCV DNN + MobileNet-SSD (PASCAL VOC, 21 classes)
Database   Supabase (PostgreSQL)
Storage    Supabase Storage
Charts     Recharts
Deploy     Frontend → Vercel · Backend → Render · DB → Supabase
```

## Architecture

```
React Frontend
    |
    | image upload
    v
FastAPI Backend
    |
    | OpenCV + MobileNet-SSD
    v
Object Detection Result
    |
    | save image + JSON
    v
Supabase Storage + Database
    |
    | fetch history
    v
React History Page
```

## How detection works

1. Uploaded image is decoded and resized to 300x300, converted into a "blob"
2. The blob is passed through a MobileNet-SSD model (`cv2.dnn`)
3. Every candidate detection below **0.8 confidence** is discarded
4. Remaining detections get bounding boxes drawn and labels counted
5. Both the original and the boxed image are uploaded to Supabase Storage;
   counts + detections are saved to the database
6. The saved record (with public image URLs) is returned to the frontend

## API endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/detect` | Upload an image, run detection, save + return the result |
| `GET` | `/history` | List recent detections, newest first |
| `GET` | `/result/{id}` | Fetch one saved detection by id |

Example `/detect` response:
```json
{
  "id": "b3f1...",
  "original_image_url": "https://.../original-....jpg",
  "processed_image_url": "https://.../processed-....jpg",
  "counts": { "bottle": 5, "person": 2, "chair": 1 },
  "detections": [
    { "label": "bottle", "confidence": 0.912, "box": { "x": 120, "y": 80, "w": 60, "h": 180 } }
  ],
  "created_at": "2026-07-06T10:15:00Z"
}
```

## Database schema

```sql
create table detections (
  id uuid primary key default gen_random_uuid(),
  original_image_url text,
  processed_image_url text,
  counts jsonb,
  detections jsonb,
  created_at timestamp default now()
);
```

## Screenshots

*Add screenshots here once you have the app running — a shot of `/detect`
mid-result and one of `/history` cover the two most useful views.*

## Setup instructions

See [`backend/SETUP.md`](backend/SETUP.md) and
[`frontend/SETUP.md`](frontend/SETUP.md) for full local setup, including
where to get the MobileNet-SSD model files and how to configure Supabase.

Quick version:
```bash
# backend
cd backend/app
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload

# frontend (separate terminal)
cd frontend
npm install
npm run dev
```

## Deployment

Full walkthrough in [`DEPLOY.md`](DEPLOY.md) — Render for the backend,
Vercel for the frontend, Supabase already hosted.

- **Live app:** https://your-vercel-url.vercel.app
- **API:** https://inventory-object-counter.onrender.com
## Future improvements

```
Confidence slider in the UI
CSV export of counts
Delete / re-run buttons on history items
Search history by object name
Multi-image (batch) upload
Compare two shelf images over time
Low-stock alert threshold
```

## License

Personal / learning project — no license applied yet. Add one
(MIT is a common simple choice) if you plan to make the repo public.