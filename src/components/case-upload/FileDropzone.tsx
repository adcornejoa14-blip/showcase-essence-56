import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  value: File[];
  onChange: (files: File[]) => void;
  previewType: "image" | "file";
  example?: string;
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const FileDropzone = ({
  label,
  required,
  accept,
  multiple,
  value,
  onChange,
  previewType,
  example,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (previewType !== "image") {
      setPreviews([]);
      return;
    }
    const urls = value.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [value, previewType]);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const arr = Array.from(files);
      if (multiple) {
        onChange([...value, ...arr]);
      } else {
        onChange([arr[0]]);
      }
    },
    [multiple, onChange, value],
  );

  const removeAt = (i: number) => {
    const next = value.slice();
    next.splice(i, 1);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-light text-foreground/80">
          {label}
          {required && <span className="ml-1 text-foreground/80">*</span>}
        </label>
      </div>

      <div className="flex gap-3">
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex-1 cursor-pointer rounded-md border border-dashed border-border px-4 py-6 text-center transition-colors hover:border-foreground/40 hover:bg-foreground/5",
            isDragging && "border-foreground/40 bg-foreground/5",
          )}
        >
          <Upload className="mx-auto h-5 w-5 text-foreground/50" />
          <p className="mt-2 text-xs font-light text-foreground/60">
            Arrastra o haz clic para subir
          </p>
          {accept && (
            <p className="mt-1 text-[10px] font-light text-foreground/40">{accept}</p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {example && (
          <div className="flex w-16 flex-col items-center gap-1">
            <img
              src={example}
              alt="Ejemplo"
              className="h-16 w-16 rounded-md border border-border object-cover"
            />
            <span className="text-[10px] font-light text-foreground/50">Ejemplo</span>
          </div>
        )}
      </div>

      {value.length > 0 && previewType === "image" && (
        <div className="flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative h-16 w-16">
              <img
                src={src}
                alt={value[i].name}
                className="h-full w-full rounded-md border border-border object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-foreground/70 hover:text-foreground"
                aria-label="Quitar archivo"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && previewType === "file" && (
        <ul className="space-y-1">
          {value.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-xs font-light text-foreground/80"
            >
              <span className="truncate pr-2">
                {f.name} <span className="text-foreground/40">· {formatBytes(f.size)}</span>
              </span>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="text-foreground/50 hover:text-foreground"
                aria-label="Quitar archivo"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
