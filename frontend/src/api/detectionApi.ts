const API_URL = import.meta.env.VITE_API_URL;

export interface Detection {
  label: string;
  confidence: number;
  box: { x: number; y: number; w: number; h: number };
}

export interface DetectionRecord {
  id: string;
  original_image_url: string;
  processed_image_url: string;
  counts: Record<string, number>;
  detections: Detection[];
  created_at: string;
}

export async function detectObjects(file: File): Promise<DetectionRecord> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_URL}/detect`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || "Detection failed");
  }

  return response.json();
}

export async function fetchHistory(): Promise<DetectionRecord[]> {
  const response = await fetch(`${API_URL}/history`);
  if (!response.ok) throw new Error("Failed to load history");
  return response.json();
}

export async function fetchResult(id: string): Promise<DetectionRecord> {
  const response = await fetch(`${API_URL}/result/${id}`);
  if (!response.ok) throw new Error("Result not found");
  return response.json();
}

