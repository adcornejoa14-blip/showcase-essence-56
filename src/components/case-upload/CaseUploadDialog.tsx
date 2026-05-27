import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileDropzone } from "./FileDropzone";
import { ToothSelector } from "./ToothSelector";
import { isImplantService, isPerToothService } from "@/lib/caseRequirements";
import { PLATFORM_FEE_RATE, type Service } from "@/data/services";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type TechnicianLite = { name: string; city: string; slug: string };
export type CartItem = { service: Service; quantity: number };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  technician: TechnicianLite;
  onSubmitted?: () => void;
};

type CaseFormData = {
  service: Service;
  indexInService: number;
  toothCount: number;
  toothNumbers: string[];
  patientName: string;
  extraoralRest: File[];
  extraoralNatural: File[];
  extraoralMax: File[];
  intraoralFrontal: File[];
  stlUpper: File[];
  stlLower: File[];
  stlBite: File[];
  cbct: File[];
  notes: string;
};

const newCase = (
  service: Service,
  indexInService: number,
  toothCount: number,
): CaseFormData => ({
  service,
  indexInService,
  toothCount,
  toothNumbers: [],
  patientName: "",
  extraoralRest: [],
  extraoralNatural: [],
  extraoralMax: [],
  intraoralFrontal: [],
  stlUpper: [],
  stlLower: [],
  stlBite: [],
  cbct: [],
  notes: "",
});

const flattenCart = (cart: CartItem[]): CaseFormData[] => {
  const out: CaseFormData[] = [];
  for (const item of cart) {
    if (isPerToothService(item.service.slug)) {
      // Single form grouping all teeth
      out.push(newCase(item.service, 1, item.quantity));
    } else {
      // One form per unit (different patient)
      for (let i = 0; i < item.quantity; i++) {
        out.push(newCase(item.service, i + 1, 1));
      }
    }
  }
  return out;
};

const isCaseValid = (c: CaseFormData): boolean => {
  const implant = isImplantService(c.service.slug);
  const perTooth = isPerToothService(c.service.slug);
  const toothOk = !perTooth || c.toothNumbers.length >= c.toothCount;
  return (
    c.patientName.trim().length > 0 &&
    toothOk &&
    c.extraoralRest.length > 0 &&
    c.extraoralNatural.length > 0 &&
    c.extraoralMax.length > 0 &&
    c.intraoralFrontal.length > 0 &&
    c.stlUpper.length > 0 &&
    c.stlLower.length > 0 &&
    c.stlBite.length > 0 &&
    (!implant || c.cbct.length > 0)
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="border-b border-border pb-2 text-xs font-light uppercase tracking-[0.15em] text-foreground/60">
    {children}
  </h3>
);

export const CaseUploadDialog = ({ open, onOpenChange, cart, technician, onSubmitted }: Props) => {
  const [cases, setCases] = useState<CaseFormData[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const today = new Date().toLocaleDateString("en-US");

  useEffect(() => {
    if (open) {
      setCases(flattenCart(cart));
      setActiveIdx(0);
    }
  }, [open, cart]);

  const totalCases = cases.length;
  const completedCount = useMemo(() => cases.filter(isCaseValid).length, [cases]);
  const allValid = totalCases > 0 && completedCount === totalCases;
  const active = cases[activeIdx];

  const updateActive = (patch: Partial<CaseFormData>) => {
    setCases((prev) => prev.map((c, i) => (i === activeIdx ? { ...c, ...patch } : c)));
  };

  const handleSubmit = () => {
    if (!allValid) return;
    toast.success(`${totalCases} case${totalCases === 1 ? "" : "s"} submitted (demo)`);
    onSubmitted?.();
    onOpenChange(false);
  };

  if (!active) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md" />
      </Dialog>
    );
  }

  const isImplant = isImplantService(active.service.slug);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-hidden p-0">
        <div className="flex max-h-[90vh] flex-col">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle className="font-light">
              Request {totalCases} case{totalCases === 1 ? "" : "s"}
            </DialogTitle>
            <DialogDescription className="font-light">
              To {technician.name} · {technician.city} — {completedCount} of {totalCases} complete
            </DialogDescription>
          </DialogHeader>

          <div className="grid flex-1 overflow-hidden md:grid-cols-[220px_1fr]">
            {/* Case sidebar */}
            <nav className="overflow-y-auto border-b border-border bg-muted/20 md:border-b-0 md:border-r">
              <ul className="flex md:block">
                {cases.map((c, i) => {
                  const valid = isCaseValid(c);
                  const isActive = i === activeIdx;
                  return (
                    <li key={i} className="flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveIdx(i)}
                        className={`flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-light transition-colors ${
                          isActive
                            ? "border-l-2 border-foreground bg-background text-foreground"
                            : "border-l-2 border-transparent text-foreground/70 hover:bg-background/60"
                        }`}
                      >
                        <span className="truncate">
                          {c.service.name}{" "}
                          <span className="text-foreground/40">
                            {isPerToothService(c.service.slug)
                              ? `· ${c.toothCount} tooth${c.toothCount === 1 ? "" : "s"}`
                              : `#${c.indexInService}`}
                          </span>
                        </span>
                        {valid && <Check className="h-3.5 w-3.5 text-foreground/50" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Active case form */}
            <div className="overflow-y-auto px-6 py-6">
              <div className="mb-6">
                <p className="text-xs font-light uppercase tracking-[0.2em] text-foreground/50">
                  {active.service.name}
                  {isPerToothService(active.service.slug)
                    ? ` · ${active.toothCount} tooth${active.toothCount === 1 ? "" : "s"}`
                    : ` · Case #${active.indexInService}`}
                </p>
              </div>

              <div className="space-y-8">
                {/* Patient */}
                <section className="space-y-4">
                  <SectionTitle>Patient</SectionTitle>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-light text-foreground/80">
                        Patient full name <span className="text-foreground/80">*</span>
                      </label>
                      <Input
                        value={active.patientName}
                        onChange={(e) => updateActive({ patientName: e.target.value })}
                        placeholder="First and last name"
                        maxLength={120}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-light text-foreground/80">Date</label>
                      <Input value={today} readOnly className="bg-muted/30" />
                    </div>
                  </div>

                  {isPerToothService(active.service.slug) && (
                    <div className="space-y-2">
                      <label className="text-sm font-light text-foreground/80">
                        Select the {active.toothCount} tooth{active.toothCount === 1 ? "" : "s"} to treat{" "}
                        <span className="text-foreground/80">*</span>
                      </label>
                      <ToothSelector
                        value={active.toothNumbers}
                        onChange={(teeth) => updateActive({ toothNumbers: teeth })}
                        maxCount={active.toothCount}
                      />
                    </div>
                  )}
                </section>

                {/* Extraoral photos */}
                <section className="space-y-4">
                  <SectionTitle>Extraoral photos</SectionTitle>
                  <div className="grid gap-4 md:grid-cols-3">
                    <FileDropzone
                      label="Smile at rest"
                      required
                      accept="image/*"
                      previewType="image"
                      value={active.extraoralRest}
                      onChange={(files) => updateActive({ extraoralRest: files })}
                    />
                    <FileDropzone
                      label="Natural smile"
                      required
                      accept="image/*"
                      previewType="image"
                      value={active.extraoralNatural}
                      onChange={(files) => updateActive({ extraoralNatural: files })}
                    />
                    <FileDropzone
                      label="Maximum smile"
                      required
                      accept="image/*"
                      previewType="image"
                      value={active.extraoralMax}
                      onChange={(files) => updateActive({ extraoralMax: files })}
                    />
                  </div>
                </section>

                {/* Intraoral photos */}
                <section className="space-y-4">
                  <SectionTitle>Intraoral photos</SectionTitle>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FileDropzone
                      label="Anterior frontal view"
                      required
                      accept="image/*"
                      previewType="image"
                      value={active.intraoralFrontal}
                      onChange={(files) => updateActive({ intraoralFrontal: files })}
                    />
                  </div>
                </section>

                {/* Digital files */}
                <section className="space-y-4">
                  <SectionTitle>Digital files (STL)</SectionTitle>
                  <div className="grid gap-4 md:grid-cols-3">
                    <FileDropzone
                      label="Upper jaw STL"
                      required
                      accept=".stl,.ply"
                      previewType="file"
                      value={active.stlUpper}
                      onChange={(files) => updateActive({ stlUpper: files })}
                    />
                    <FileDropzone
                      label="Lower jaw STL"
                      required
                      accept=".stl,.ply"
                      previewType="file"
                      value={active.stlLower}
                      onChange={(files) => updateActive({ stlLower: files })}
                    />
                    <FileDropzone
                      label="Bite STL"
                      required
                      accept=".stl,.ply"
                      previewType="file"
                      value={active.stlBite}
                      onChange={(files) => updateActive({ stlBite: files })}
                    />
                  </div>
                </section>

                {isImplant && (
                  <section className="space-y-4">
                    <SectionTitle>CT scan</SectionTitle>
                    <FileDropzone
                      label="CBCT (DICOM, .zip recommended)"
                      required
                      accept=".zip,.dcm"
                      multiple
                      previewType="file"
                      value={active.cbct}
                      onChange={(files) => updateActive({ cbct: files })}
                    />
                  </section>
                )}

                <section className="space-y-4">
                  <SectionTitle>Additional notes</SectionTitle>
                  <Textarea
                    value={active.notes}
                    onChange={(e) => updateActive({ notes: e.target.value })}
                    placeholder="Instructions, target shade, references, etc."
                    rows={4}
                    maxLength={1000}
                  />
                </section>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 border-t border-border px-6 py-4 sm:gap-2">
            <div className="mr-auto flex items-center gap-3 text-xs font-light text-foreground/60">
              {activeIdx > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                  className="underline-offset-2 hover:underline"
                >
                  ← Previous
                </button>
              )}
              {activeIdx < totalCases - 1 && (
                <button
                  type="button"
                  onClick={() => setActiveIdx((i) => Math.min(totalCases - 1, i + 1))}
                  className="underline-offset-2 hover:underline"
                >
                  Next →
                </button>
              )}
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!allValid}>
              Submit {totalCases} case{totalCases === 1 ? "" : "s"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
