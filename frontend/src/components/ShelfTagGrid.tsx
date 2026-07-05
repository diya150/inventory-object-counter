interface Props {
  counts: Record<string, number>;
}

export default function ShelfTagGrid({ counts }: Props) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return (
      <div className="border border-line rounded-sm p-6 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-signal mb-1">
          Zero matches
        </p>
        <p className="text-dim text-sm">
          No objects cleared the confidence threshold. Try a clearer or closer photo.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {entries.map(([label, count]) => (
        <div key={label} className="shelf-tag">
          <div className="barcode mb-3">
            {Array.from({ length: 16 }).map((_, i) => (
              <span
                key={i}
                style={{ width: i % 3 === 0 ? 3 : 1, height: "100%" }}
              />
            ))}
          </div>
          <div className="font-mono text-4xl font-semibold leading-none mb-1">
            {String(count).padStart(2, "0")}
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-ink/70">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
