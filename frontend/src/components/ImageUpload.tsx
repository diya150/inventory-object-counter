import { useCallback, useState } from "react";

interface Props {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export default function ImageUpload({ onFileSelected, disabled }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  };

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        block cursor-pointer border-2 border-dashed rounded-sm
        px-8 py-16 text-center transition-colors
        ${isDragging ? "border-safety bg-raised" : "border-line bg-surface"}
        ${disabled ? "opacity-50 pointer-events-none" : ""}
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />
      <div className="font-mono text-xs uppercase tracking-widest text-safety mb-3">
        Scan Input
      </div>
      <p className="font-display text-lg text-ink2 mb-2">
        Drop a shelf photo here
      </p>
      <p className="text-dim text-sm">or click to browse — JPG or PNG</p>
    </label>
  );
}
