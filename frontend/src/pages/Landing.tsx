import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <div className="font-mono text-xs uppercase tracking-widest text-safety mb-4">
        Stock check, automated
      </div>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight text-ink2 mb-6">
        Count what's<br />on the shelf.
      </h1>
      <p className="text-dim text-lg mb-10 max-w-xl">
        Upload a photo of a shelf, room, or storage area. The model finds every
        bottle, box, chair, and person in frame, then hands you back a clean
        count — no manual tally needed.
      </p>
      <div className="flex gap-4">
        <Link
          to="/detect"
          className="bg-safety text-ink font-mono text-sm uppercase tracking-widest px-6 py-3 rounded-sm hover:bg-opacity-90 transition-colors"
        >
          Start a scan
        </Link>
        <Link
          to="/history"
          className="border border-line text-ink2 font-mono text-sm uppercase tracking-widest px-6 py-3 rounded-sm hover:border-dim transition-colors"
        >
          View log
        </Link>
      </div>
    </div>
  );
}


