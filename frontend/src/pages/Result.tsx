import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DetectionResult from "../components/DetectionResult";
import { fetchResult, DetectionRecord } from "../api/detectionApi";

export default function Result() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<DetectionRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchResult(id)
      .then(setRecord)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="font-mono text-sm text-signal mb-4">{error}</p>
        <Link to="/history" className="text-safety font-mono text-sm uppercase tracking-widest">
          ← Back to log
        </Link>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-dim font-mono text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
      <div>
        <Link to="/history" className="text-dim hover:text-ink2 font-mono text-xs uppercase tracking-widest">
          ← Back to log
        </Link>
        <h1 className="font-display text-2xl text-ink2 mt-3">
          Scan from {new Date(record.created_at).toLocaleDateString()}
        </h1>
      </div>
      <DetectionResult record={record} />
    </div>
  );
}
