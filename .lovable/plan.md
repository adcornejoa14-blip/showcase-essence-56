
# Catálogo de servicios por técnico + selector para el dentista

## Qué construir

Añadir un sistema de **servicios** al marketplace, asignar un subconjunto aleatorio (pero estable) a cada técnico, mostrarlos en su perfil y permitir al dentista **seleccionar uno** desde el perfil del técnico.

Sin backend todavía: la selección abre un modal de confirmación ("Solicitar [servicio] a [técnico]") con un botón placeholder. Listo para conectar más adelante a un flujo de pedido real.

## Estructura de datos

### Nuevo: `src/data/services.ts`

```ts
export type ServiceCategory =
  | "Aesthetic Anterior Dentistry"
  | "Posterior Dentistry"
  | "Implant Dentistry";

export type Service = { slug: string; name: string; category: ServiceCategory };

export const services: Service[] = [
  // Aesthetic Anterior Dentistry
  { slug: "cadcam-veneers",         name: "CAD/CAM Veneers Design",        category: "Aesthetic Anterior Dentistry" },
  { slug: "cadcam-crown-anterior",  name: "CAD/CAM Crown Design (Anterior)", category: "Aesthetic Anterior Dentistry" },
  { slug: "mockup-dsd",             name: "Mock-Up (Digital Smile Design)", category: "Aesthetic Anterior Dentistry" },
  { slug: "wax-up",                 name: "Wax-Up (Diagnostic)",           category: "Aesthetic Anterior Dentistry" },
  // Posterior
  { slug: "inlays",   name: "Inlays",   category: "Posterior Dentistry" },
  { slug: "onlays",   name: "Onlays",   category: "Posterior Dentistry" },
  { slug: "overlays", name: "Overlays", category: "Posterior Dentistry" },
  // Implant
  { slug: "surgical-guide",         name: "Surgical Guide (Implant Guide)",     category: "Implant Dentistry" },
  { slug: "surgical-guide-crown",   name: "Surgical Guide + Crown Design",      category: "Implant Dentistry" },
];
```

### `src/data/technicians.ts`

- Añadir `services: string[]` (array de slugs) a cada técnico.
- Asignación **fija pero variada** (no `Math.random()` en runtime — se mantiene estable entre renders y entre sesiones). Cada técnico recibe 4–6 servicios cubriendo al menos 2 categorías. Ejemplo:
  - Santiago: veneers, crown-anterior, wax-up, inlays, overlays
  - Raúl: mockup-dsd, wax-up, onlays, surgical-guide-crown
  - Ricardo: veneers, crown-anterior, mockup-dsd, surgical-guide, surgical-guide-crown
  - Luiz: wax-up, inlays, onlays, overlays, surgical-guide
- `getTechnicianBySlug` devuelve también `services: Service[]` (resueltos desde slugs vía un helper en `services.ts`).

## UI

### `src/pages/TechnicianProfile.tsx`

Nueva sección **entre el header y la galería**:

- Título pequeño: "Servicios".
- Servicios agrupados por categoría (3 sub-bloques). Cada categoría: subtítulo discreto + lista de "chips" seleccionables (botones tipo pill, estilo `border` + `rounded-full`, en línea con el lenguaje minimal actual — Poppins, sin colores nuevos).
- Estado local `selected: Service | null`. Click en un chip → `setSelected(service)` y abre `<Dialog>`.
- Dialog: 
  - Título: `Solicitar servicio`
  - Texto: `¿Quieres solicitar "{service.name}" a {technician.name}?`
  - Dos botones: **Cancelar** (cierra) y **Confirmar solicitud** (placeholder — por ahora solo cierra el modal y muestra un `toast` "Solicitud enviada (demo)"; sin lógica real).

Sin cambios en home, header, ni datos de imágenes.

## Archivos afectados

- **Nuevo:** `src/data/services.ts`
- **Editado:** `src/data/technicians.ts` — añadir `services` a cada técnico + exponerlos en `getTechnicianBySlug`.
- **Editado:** `src/pages/TechnicianProfile.tsx` — sección de servicios + modal de solicitud.

## Resultado

En el perfil de cada técnico aparece un bloque "Servicios" con sus especialidades agrupadas por categoría. El dentista pulsa el servicio que quiere y se abre un modal para confirmar la solicitud (UI lista, lógica de envío pendiente).
