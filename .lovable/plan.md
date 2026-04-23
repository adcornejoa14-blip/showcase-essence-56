
# Galería estilo Instagram en el perfil del técnico

## Qué hacer

En `/tecnico/:slug`, mostrar las fotos del portafolio como una **cuadrícula tipo Instagram** (cuadradas, pequeñas, sin separación o con separación mínima). Al **tocar/clicar una foto**, se abre la **publicación** en un modal con la imagen completa (sin recorte) centrada.

## Cambios

### 1. `src/pages/TechnicianProfile.tsx`

- Reemplazar la lista vertical de imágenes grandes por un **grid 3 columnas** (mobile y desktop, igual que Instagram), con `gap-1` y celdas `aspect-square` + `object-cover`.
- Estado local `openIndex: number | null` para saber qué publicación está abierta.
- Al clicar una celda → `setOpenIndex(i)`.
- Renderizar un `<Dialog>` (shadcn, ya disponible) controlado por `open={openIndex !== null}`:
  - `DialogContent` con ancho amplio (`max-w-3xl`), padding mínimo, fondo del tema.
  - Dentro: la imagen completa (`object-contain`, `max-h-[85vh]`, `w-full`) — así se ve **la publicación entera**, sin recorte.
  - Pie discreto opcional: `Foto N de M`.
- Mantener la **foto de perfil circular** y el header tal como están.

### 2. Sin cambios en `src/data/technicians.ts`

El shape `{ profileImage, gallery }` ya sirve.

### 3. Sin tocar `GalleryItem.tsx`

La cuadrícula del perfil será inline (más simple y específica), sin reutilizar el componente de la home — son contextos distintos.

## Detalles visuales

- Grid: `grid grid-cols-3 gap-1` en todos los tamaños (puro Instagram). En desktop ancho se puede limitar el contenedor a `max-w-3xl mx-auto` para que las celdas no queden gigantes.
- Hover desktop: leve `opacity-90` sobre la celda — sutil, sin etiquetas.
- Cursor `pointer` en cada celda.
- Modal: fondo `bg-background`, imagen centrada, sin bordes decorativos. El `DialogClose` por defecto de shadcn (esquina) basta.

## Archivos afectados

- `src/pages/TechnicianProfile.tsx` — único cambio.

## Resultado

El perfil del técnico se ve como un perfil de Instagram: foto de perfil arriba, cuadrícula 3×N de miniaturas cuadradas debajo. Al tocar una miniatura, se abre la imagen completa en un modal — la "publicación".
