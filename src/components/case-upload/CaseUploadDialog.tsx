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
import { isImplantService, isPerToothService } from "@/lib/caseRequirements";
import type { Service } from "@/data/services";

type TechnicianLite = { name: string; city: string };
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
  toothNumbers: string;
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
  toothNumbers: "",
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
      // Una sola ficha agrupando todas las piezas
      out.push(newCase(item.service, 1, item.quantity));
    } else {
      // Una ficha por unidad (paciente distinto)
      for (let i = 0; i < item.quantity; i++) {
        out.push(newCase(item.service, i + 1, 1));
      }
    }
  }
  return out;
};

const parseTeeth = (s: string): string[] =>
  s.split(",").map((t) => t.trim()).filter(Boolean);

const isCaseValid = (c: CaseFormData): boolean => {
  const implant = isImplantService(c.service.slug);
  const perTooth = isPerToothService(c.service.slug);
  const teeth = parseTeeth(c.toothNumbers);
  const toothOk = !perTooth || teeth.length >= c.toothCount;
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
  const today = new Date().toLocaleDateString("es-ES");

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
    toast.success(`${totalCases} caso${totalCases === 1 ? "" : "s"} enviado${totalCases === 1 ? "" : "s"} (demo)`);
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
              Solicitar {totalCases} ficha{totalCases === 1 ? "" : "s"}
            </DialogTitle>
            <DialogDescription className="font-light">
              A {technician.name} · {technician.city} — {completedCount} de {totalCases} completos
            </DialogDescription>
          </DialogHeader>

          <div className="grid flex-1 overflow-hidden md:grid-cols-[220px_1fr]">
            {/* Sidebar de casos */}
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
                          {c.service.name} <span className="text-foreground/40">#{c.indexInService}</span>
                        </span>
                        {valid && <Check className="h-3.5 w-3.5 text-foreground/50" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Formulario del caso activo */}
            <div className="overflow-y-auto px-6 py-6">
              <div className="mb-6">
                <p className="text-xs font-light uppercase tracking-[0.2em] text-foreground/50">
                  {active.service.name} · Caso #{active.indexInService}
                </p>
              </div>

              <div className="space-y-8">
                {/* Paciente */}
                <section className="space-y-4">
                  <SectionTitle>Paciente</SectionTitle>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-light text-foreground/80">
                        Nombre completo del paciente <span className="text-foreground/80">*</span>
                      </label>
                      <Input
                        value={active.patientName}
                        onChange={(e) => updateActive({ patientName: e.target.value })}
                        placeholder="Nombre y apellidos"
                        maxLength={120}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-light text-foreground/80">Fecha</label>
                      <Input value={today} readOnly className="bg-muted/30" />
                    </div>
                  </div>
                </section>

                {/* Fotos extraorales */}
                <section className="space-y-4">
                  <SectionTitle>Fotos extraorales</SectionTitle>
                  <div className="grid gap-4 md:grid-cols-3">
                    <FileDropzone
                      label="Sonrisa en reposo"
                      required
                      accept="image/*"
                      previewType="image"
                      value={active.extraoralRest}
                      onChange={(files) => updateActive({ extraoralRest: files })}
                    />
                    <FileDropzone
                      label="Sonrisa natural"
                      required
                      accept="image/*"
                      previewType="image"
                      value={active.extraoralNatural}
                      onChange={(files) => updateActive({ extraoralNatural: files })}
                    />
                    <FileDropzone
                      label="Sonrisa máxima"
                      required
                      accept="image/*"
                      previewType="image"
                      value={active.extraoralMax}
                      onChange={(files) => updateActive({ extraoralMax: files })}
                    />
                  </div>
                </section>

                {/* Fotos intraorales */}
                <section className="space-y-4">
                  <SectionTitle>Fotos intraorales</SectionTitle>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FileDropzone
                      label="Vista frontal anterior"
                      required
                      accept="image/*"
                      previewType="image"
                      value={active.intraoralFrontal}
                      onChange={(files) => updateActive({ intraoralFrontal: files })}
                    />
                  </div>
                </section>

                {/* Archivos digitales */}
                <section className="space-y-4">
                  <SectionTitle>Archivos digitales (STL)</SectionTitle>
                  <div className="grid gap-4 md:grid-cols-3">
                    <FileDropzone
                      label="STL maxilar superior"
                      required
                      accept=".stl,.ply"
                      previewType="file"
                      value={active.stlUpper}
                      onChange={(files) => updateActive({ stlUpper: files })}
                    />
                    <FileDropzone
                      label="STL mandíbula"
                      required
                      accept=".stl,.ply"
                      previewType="file"
                      value={active.stlLower}
                      onChange={(files) => updateActive({ stlLower: files })}
                    />
                    <FileDropzone
                      label="STL de mordida"
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
                    <SectionTitle>Tomografía</SectionTitle>
                    <FileDropzone
                      label="CBCT (DICOM, .zip recomendado)"
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
                  <SectionTitle>Notas adicionales</SectionTitle>
                  <Textarea
                    value={active.notes}
                    onChange={(e) => updateActive({ notes: e.target.value })}
                    placeholder="Indicaciones, color objetivo, referencias, etc."
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
                  ← Anterior
                </button>
              )}
              {activeIdx < totalCases - 1 && (
                <button
                  type="button"
                  onClick={() => setActiveIdx((i) => Math.min(totalCases - 1, i + 1))}
                  className="underline-offset-2 hover:underline"
                >
                  Siguiente →
                </button>
              )}
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!allValid}>
              Enviar {totalCases} caso{totalCases === 1 ? "" : "s"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
