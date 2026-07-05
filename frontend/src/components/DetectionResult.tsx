import { DetectionRecord } from "../api/detectionApi";
import ShelfTagGrid from "./ShelfTagGrid";
import ObjectBarChart from "./ObjectBarChart";

interface Props {
  record: DetectionRecord;
}

export default function DetectionResult({ record }: Props) {
  const total = Object.values(record.counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <div>
        <div className="font-mono text-xs uppercase tracking-widest text-safety mb-2">
          Processed — {total} object{total === 1 ? "" : "s"} found
        </div>
        <img
          src={record.processed_image_url}
          alt="Detected objects with bounding boxes"
          className="w-full rounded-sm border border-line"
        />
      </div>

      <div>
        <div className="font-mono text-xs uppercase tracking-widest text-dim mb-3">
          Count by class
        </div>
        <ShelfTagGrid counts={record.counts} />
      </div>

      <div>
        <div className="font-mono text-xs uppercase tracking-widest text-dim mb-3">
          Distribution
        </div>
        <ObjectBarChart counts={record.counts} />
      </div>
    </div>
  );
}
