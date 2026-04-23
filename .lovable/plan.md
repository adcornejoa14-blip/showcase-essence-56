
# Formulario de subida de casos por servicio

## Qué construir

Sustituir el modal actual de "Confirmar solicitud" por un **formulario completo de subida de caso** que se abre al pulsar un servicio en el perfil del técnico. El formulario adapta sus requisitos según el servicio: implantología pide CBCT extra; el resto comparte la base estándar.

Sin backend: los archivos se guardan en estado local, se previsualizan, y al enviar se muestra `toast` "Caso enviado (demo)" + reset.

## Estructura

### Nuevo: `src/lib/caseRequirements.ts`

Helper para saber si un servicio es de implantología:

```ts
import { services } from "@/data/services";
export const isImplantService = (slug: string) =>
  services.find(s => s.slug === slug)?.category === "Implant Dentistry";
```

### Nuevo: `src/components/case-upload/FileDropzone.tsx`

Componente reutilizable de drag & drop:
- Props: `label`, `accept`, `multiple?`, `value: File[]`, `onChange(files: File[])`, `previewType: "image" | "file"`, `example?: string` (URL ilustrativa opcional).
- UI: zona `border-dashed rounded-md` con icono (`Upload` de lucide), texto "Arrastra o haz clic para subir", input file oculto, eventos `onDragOver/onDrop`.
- Si hay archivos:
  - `previewType="image"` → miniaturas cuadradas con `URL.createObjectURL`, botón X para eliminar.
  - `previewType="file"` → lista con nombre + tamaño + X.
- Si `example` está presente → pequeño thumbnail de referencia con label "Ejemplo" al lado del dropzone (guía visual de ángulo/calidad).
- Cleanup de object URLs en unmount.

### Nuevo: `src/components/case-upload/CaseUploadDialog.tsx`

Modal con el formulario completo. Props: `open`, `onOpenChange`, `service`, `technician`.

**Layout** (`DialogContent` con `max-w-3xl max-h-[90vh] overflow-y-auto`):

1. **Header**
   - `Solicitar: {service.name}`
   - `A {technician.name} · {technician.city}`

2. **Sección "Paciente"**
   - Input `Nombre completo del paciente` (obligatorio).
   - Campo `Fecha` readonly mostrando `new Date().toLocaleDateString("es-ES")`.

3. **Sección "Fotos extraorales"** (obligatorias)
   - 3 dropzones tipo imagen, single-file cada uno:
     - Sonrisa en reposo
     - Sonrisa natural
     - Sonrisa máxima
   - Cada uno con miniatura de **ejemplo** (placeholder ilustrativo desde `/public` o URL temporal — usar `placeholder.svg` que ya existe hasta que el usuario provea referencias reales; mostrarlo con caption "Ejemplo de ángulo").

4. **Sección "Fotos intraorales"** (obligatorias)
   - 1 dropzone:
     - Vista frontal anterior (con ejemplo).

5. **Sección "Archivos digitales"** (obligatorios)
   - 3 dropzones tipo file (`.stl,.ply`):
     - STL maxilar superior
     - STL mandíbula
     - STL de mordida

6. **Sección condicional "Tomografía"** (solo si `isImplantService(service.slug)`)
   - 1 dropzone tipo file (`.zip,.dcm`, multiple) — etiqueta "CBCT (DICOM, .zip recomendado)" obligatorio.

7. **Notas** (opcional)
   - `<Textarea>` libre.

8. **Footer**
   - **Cancelar** → cierra y resetea.
   - **Enviar caso** → deshabilitado mientras falten requeridos. Al pulsar: `toast.success("Caso enviado (demo)")`, cerrar, reset.

**Estado local** (un `useState` por campo o un objeto `formData`):
- `patientName: string`
- `extraoral: { rest: File[], natural: File[], max: File[] }`
- `intraoral: { frontal: File[] }`
- `stl: { upper: File[], lower: File[], bite: File[] }`
- `cbct: File[]` (solo implant)
- `notes: string`

**Validación**: helper `isValid()` que comprueba todos los campos requeridos según `isImplantService`. El botón "Enviar caso" usa `disabled={!isValid()}`.

### Editado: `src/pages/TechnicianProfile.tsx`

- Importar `CaseUploadDialog`.
- Mantener el estado `selectedService`.
- Reemplazar el `<Dialog>` actual de confirmación por:
  ```tsx
  <CaseUploadDialog
    open={selectedService !== null}
    onOpenChange={(o) => !o && setSelectedService(null)}
    service={selectedService}
    technician={technician}
  />
  ```
- Eliminar imports ya no usados (`DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` del modal de confirmación; `Button` se mantiene si se usa en otro sitio — comprobar).

## Detalles de UX/visual

- Lenguaje minimal coherente con el resto del perfil: `font-light`, bordes `border-border`, sin colores nuevos.
- Cada sección con `<h3>` en `text-sm font-light uppercase tracking-[0.15em] text-foreground/60` + separador inferior sutil (`border-b border-border pb-2`).
- Dropzones: estado `hover` y `dragover` con `border-foreground/40 bg-foreground/5`.
- Miniaturas de ejemplo: 64×64 con caption pequeño en gris.
- Asterisco rojo discreto (`text-foreground/80`) en labels obligatorios — sin introducir un color nuevo, solo peso/símbolo.
- Imagen de ejemplo placeholder: usar `/placeholder.svg` ya existente para todas las guías visuales (el usuario podrá reemplazar las URLs después).

## Archivos afectados

- **Nuevo:** `src/lib/caseRequirements.ts`
- **Nuevo:** `src/components/case-upload/FileDropzone.tsx`
- **Nuevo:** `src/components/case-upload/CaseUploadDialog.tsx`
- **Editado:** `src/pages/TechnicianProfile.tsx` — sustituir modal de confirmación por `CaseUploadDialog`.

## Resultado

Al pulsar un servicio, el dentista ve un formulario claro y por secciones donde sube los datos del paciente, las fotos extra/intraorales con guías visuales, los STL y — si es implantología — además el CBCT. Drag & drop, previsualizaciones, validación de obligatorios y envío demo.
