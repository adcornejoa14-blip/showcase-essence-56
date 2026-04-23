import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { isImplantService } from "@/lib/caseRequirements";
import type { Service } from "@/data/services";

type TechnicianLite = { name: string; city: string };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  technician: TechnicianLite;
};



const initialState = () => ({
  patientName: "",
  extraoralRest: [] as File[],
  extraoralNatural: [] as File[],
  extraoralMax: [] as File[],
  intraoralFrontal: [] as File[],
  stlUpper: [] as File[],
  stlLower: [] as File[],
  stlBite: [] as File[],
  cbct: [] as File[],
  notes: "",
});

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="border-b border-border pb-2 text-xs font-light uppercase tracking-[0.15em] text-foreground/60">
    {children}
  </h3>
);

export const CaseUploadDialog = ({ open, onOpenChange, service, technician }: Props) => {
  const [data, setData] = useState(initialState());
  const today = new Date().toLocaleDateString("es-ES");
  const isImplant = service ? isImplantService(service.slug) : false;

  useEffect(() => {
    if (!open) setData(initialState());
  }, [open]);

  const isValid =
    data.patientName.trim().length > 0 &&
    data.extraoralRest.length > 0 &&
    data.extraoralNatural.length > 0 &&
    data.extraoralMax.length > 0 &&
    data.intraoralFrontal.length > 0 &&
    data.stlUpper.length > 0 &&
    data.stlLower.length > 0 &&
    data.stlBite.length > 0 &&
    (!isImplant || data.cbct.length > 0);

  const handleSubmit = () => {
    if (!isValid) return;
    toast.success("Caso enviado (demo)");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-light">
            Solicitar: {service?.name}
          </DialogTitle>
          <DialogDescription className="font-light">
            A {technician.name} · {technician.city}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-2">
          {/* Paciente */}
          <section className="space-y-4">
            <SectionTitle>Paciente</SectionTitle>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-light text-foreground/80">
                  Nombre completo del paciente <span className="text-foreground/80">*</span>
                </label>
                <Input
                  value={data.patientName}
                  onChange={(e) => setData({ ...data, patientName: e.target.value })}
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
                value={data.extraoralRest}
                onChange={(files) => setData({ ...data, extraoralRest: files })}
              />
              <FileDropzone
                label="Sonrisa natural"
                required
                accept="image/*"
                previewType="image"
                value={data.extraoralNatural}
                onChange={(files) => setData({ ...data, extraoralNatural: files })}
              />
              <FileDropzone
                label="Sonrisa máxima"
                required
                accept="image/*"
                previewType="image"
                value={data.extraoralMax}
                onChange={(files) => setData({ ...data, extraoralMax: files })}
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
                value={data.intraoralFrontal}
                onChange={(files) => setData({ ...data, intraoralFrontal: files })}
                
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
                value={data.stlUpper}
                onChange={(files) => setData({ ...data, stlUpper: files })}
              />
              <FileDropzone
                label="STL mandíbula"
                required
                accept=".stl,.ply"
                previewType="file"
                value={data.stlLower}
                onChange={(files) => setData({ ...data, stlLower: files })}
              />
              <FileDropzone
                label="STL de mordida"
                required
                accept=".stl,.ply"
                previewType="file"
                value={data.stlBite}
                onChange={(files) => setData({ ...data, stlBite: files })}
              />
            </div>
          </section>

          {/* Tomografía (solo implant) */}
          {isImplant && (
            <section className="space-y-4">
              <SectionTitle>Tomografía</SectionTitle>
              <FileDropzone
                label="CBCT (DICOM, .zip recomendado)"
                required
                accept=".zip,.dcm"
                multiple
                previewType="file"
                value={data.cbct}
                onChange={(files) => setData({ ...data, cbct: files })}
              />
            </section>
          )}

          {/* Notas */}
          <section className="space-y-4">
            <SectionTitle>Notas adicionales</SectionTitle>
            <Textarea
              value={data.notes}
              onChange={(e) => setData({ ...data, notes: e.target.value })}
              placeholder="Indicaciones, color objetivo, referencias, etc."
              rows={4}
              maxLength={1000}
            />
          </section>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Enviar caso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
