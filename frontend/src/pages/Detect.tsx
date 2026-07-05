import { useState } from "react";
import ImageUpload from "../components/ImageUpload";
import DetectionResult from "../components/DetectionResult";
import { detectObjects, DetectionRecord } from "../api/detectionApi";

export default function Detect() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setResult(null);
    setPreviewUrl(URL.createObjectURL(file));
    setIsLoading(true);

    try {
      const record = await detectObjects(file);
      setResult(record);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
      <div>
        <h1 className="font-display text-2xl text-ink2 mb-2">Run a scan</h1>
        <p className="text-dim">
          Upload one photo. Detection typically takes a few seconds.
        </p>
      </div>

      <ImageUpload onFileSelected={handleFile} disabled={isLoading} />

      {previewUrl && !result && !error && (
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-dim mb-3">
            {isLoading ? "Scanning..." : "Uploaded"}
          </div>
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className={`w-full rounded-sm border border-line ${
              isLoading ? "opacity-50" : ""
            }`}
          />
        </div>
      )}

      {error && (
        <div className="border border-signal rounded-sm p-4">
          <p className="font-mono text-xs uppercase tracking-widest text-signal mb-1">
            Scan failed
          </p>
          <p className="text-dim text-sm">{error}</p>
        </div>
      )}

      {result && <DetectionResult record={result} />}
    </div>
  );
}
