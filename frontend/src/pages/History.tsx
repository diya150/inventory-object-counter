import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchHistory, DetectionRecord } from "../api/detectionApi";

export default function History() {
  const [records, setRecords] = useState<DetectionRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory()
      .then(setRecords)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-2xl text-ink2 mb-2">Scan log</h1>
      <p className="text-dim mb-10">Every photo processed so far, newest first.</p>

      {error && (
        <p className="font-mono text-sm text-signal">Could not load history: {error}</p>
      )}

      {records && records.length === 0 && (
        <div className="border border-line rounded-sm p-8 text-center">
          <p className="text-dim">No scans yet.</p>
          <Link to="/detect" className="text-safety font-mono text-sm uppercase tracking-widest">
            Run your first one â†’
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {records?.map((record) => {
          const total = Object.values(record.counts).reduce((a, b) => a + b, 0);
          return (
            <Link
              key={record.id}
              to={`/result/${record.id}`}
              className="flex gap-4 border border-line rounded-sm p-4 hover:border-safety transition-colors"
            >
              <img
                src={record.processed_image_url}
                alt=""
                className="w-24 h-24 object-cover rounded-sm border border-line flex-shrink-0"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <div className="font-mono text-2xl text-ink2 leading-none">
                    {String(total).padStart(2, "0")}
                  </div>
                  <div className="font-mono text-xs uppercase tracking-widest text-dim">
                    objects found
                  </div>
                </div>
                <div className="font-mono text-xs text-dim">
                  {new Date(record.created_at).toLocaleString()}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

