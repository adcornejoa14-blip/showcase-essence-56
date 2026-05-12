import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Props = {
  value: string[];
  onChange: (teeth: string[]) => void;
  maxCount?: number;
};

const UPPER_RIGHT = ["18", "17", "16", "15", "14", "13", "12", "11"];
const UPPER_LEFT = ["21", "22", "23", "24", "25", "26", "27", "28"];
const LOWER_LEFT = ["31", "32", "33", "34", "35", "36", "37", "38"];
const LOWER_RIGHT = ["48", "47", "46", "45", "44", "43", "42", "41"];

const TOOTH_NAMES: Record<string, string> = {
  "11": "Upper right central incisor", "12": "Upper right lateral incisor",
  "13": "Upper right canine", "14": "Upper right 1st premolar",
  "15": "Upper right 2nd premolar", "16": "Upper right 1st molar",
  "17": "Upper right 2nd molar", "18": "Upper right 3rd molar",
  "21": "Upper left central incisor", "22": "Upper left lateral incisor",
  "23": "Upper left canine", "24": "Upper left 1st premolar",
  "25": "Upper left 2nd premolar", "26": "Upper left 1st molar",
  "27": "Upper left 2nd molar", "28": "Upper left 3rd molar",
  "31": "Lower left central incisor", "32": "Lower left lateral incisor",
  "33": "Lower left canine", "34": "Lower left 1st premolar",
  "35": "Lower left 2nd premolar", "36": "Lower left 1st molar",
  "37": "Lower left 2nd molar", "38": "Lower left 3rd molar",
  "41": "Lower right central incisor", "42": "Lower right lateral incisor",
  "43": "Lower right canine", "44": "Lower right 1st premolar",
  "45": "Lower right 2nd premolar", "46": "Lower right 1st molar",
  "47": "Lower right 2nd molar", "48": "Lower right 3rd molar",
};

export const ToothSelector = ({ value, onChange, maxCount }: Props) => {
  const selected = new Set(value);

  const toggle = (fdi: string) => {
    if (selected.has(fdi)) {
      onChange(value.filter((t) => t !== fdi));
    } else {
      onChange([...value, fdi]);
    }
  };

  const renderTooth = (fdi: string) => {
    const isSelected = selected.has(fdi);
    return (
      <Tooltip key={fdi} delayDuration={200}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => toggle(fdi)}
            className={`flex h-8 w-8 items-center justify-center rounded-md border text-[10px] font-light transition-all md:h-10 md:w-10 ${
              isSelected
                ? "border-foreground bg-foreground/10 text-foreground ring-1 ring-foreground/20"
                : "border-border bg-muted/20 text-foreground/50 hover:border-foreground/40 hover:text-foreground/80"
            }`}
            aria-pressed={isSelected}
            aria-label={`Tooth ${fdi}`}
          >
            {fdi}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs font-light">
          {fdi} — {TOOTH_NAMES[fdi]}
        </TooltipContent>
      </Tooltip>
    );
  };

  const count = value.length;
  const target = maxCount ?? 0;
  const enough = target > 0 && count >= target;

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="overflow-x-auto rounded-md border border-border bg-muted/10 p-4">
          <div className="mx-auto flex w-fit flex-col gap-3">
            {/* Upper arch */}
            <div className="flex items-center gap-1">
              <div className="flex gap-1">{UPPER_RIGHT.map(renderTooth)}</div>
              <div className="mx-1 h-8 border-l border-border/60 md:h-10" />
              <div className="flex gap-1">{UPPER_LEFT.map(renderTooth)}</div>
            </div>

            <div className="border-t border-dashed border-border/40" />

            {/* Lower arch */}
            <div className="flex items-center gap-1">
              <div className="flex gap-1">{LOWER_RIGHT.map(renderTooth)}</div>
              <div className="mx-1 h-8 border-l border-border/60 md:h-10" />
              <div className="flex gap-1">{LOWER_LEFT.map(renderTooth)}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-light">
          <span className={enough ? "text-foreground/80" : "text-foreground/60"}>
            {enough && <span className="mr-1">✓</span>}
            {count} {target > 0 ? `of ${target}` : ""} tooth{count === 1 ? "" : "s"} selected
          </span>
          {count > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-foreground/50 underline-offset-2 hover:text-foreground hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
