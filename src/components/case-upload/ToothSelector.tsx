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
  "11": "Incisivo central sup. der.", "12": "Incisivo lateral sup. der.",
  "13": "Canino sup. der.", "14": "1er premolar sup. der.",
  "15": "2º premolar sup. der.", "16": "1er molar sup. der.",
  "17": "2º molar sup. der.", "18": "3er molar sup. der.",
  "21": "Incisivo central sup. izq.", "22": "Incisivo lateral sup. izq.",
  "23": "Canino sup. izq.", "24": "1er premolar sup. izq.",
  "25": "2º premolar sup. izq.", "26": "1er molar sup. izq.",
  "27": "2º molar sup. izq.", "28": "3er molar sup. izq.",
  "31": "Incisivo central inf. izq.", "32": "Incisivo lateral inf. izq.",
  "33": "Canino inf. izq.", "34": "1er premolar inf. izq.",
  "35": "2º premolar inf. izq.", "36": "1er molar inf. izq.",
  "37": "2º molar inf. izq.", "38": "3er molar inf. izq.",
  "41": "Incisivo central inf. der.", "42": "Incisivo lateral inf. der.",
  "43": "Canino inf. der.", "44": "1er premolar inf. der.",
  "45": "2º premolar inf. der.", "46": "1er molar inf. der.",
  "47": "2º molar inf. der.", "48": "3er molar inf. der.",
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
            aria-label={`Diente ${fdi}`}
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
            {/* Arcada superior */}
            <div className="flex items-center gap-1">
              <div className="flex gap-1">{UPPER_RIGHT.map(renderTooth)}</div>
              <div className="mx-1 h-8 border-l border-border/60 md:h-10" />
              <div className="flex gap-1">{UPPER_LEFT.map(renderTooth)}</div>
            </div>

            <div className="border-t border-dashed border-border/40" />

            {/* Arcada inferior */}
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
            {count} {target > 0 ? `de ${target}` : ""} pieza{count === 1 ? "" : "s"} seleccionada
            {count === 1 ? "" : "s"}
          </span>
          {count > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-foreground/50 underline-offset-2 hover:text-foreground hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
