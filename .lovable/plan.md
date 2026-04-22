
# Perfil individual de cada técnico al hacer clic en una imagen

## Qué construir

Al hacer clic (o tap) sobre cualquier imagen de la galería, navegar a una página dedicada del técnico autor de esa pieza, mostrando todo su portafolio personal con bio breve, ciudad y rejilla con sus trabajos.

## Estructura

### Datos (`src/data/technicians.ts`)
- Añadir un identificador `slug` por técnico: `santiago-guerra`, `raul-guerra`, `ricardo-malise`, `luiz-varelas`.
- Crear una estructura paralela `techniciansBySlug` (o derivarla) con la info del técnico + array de sus imágenes.
- Mantener el array actual `technicians` (la galería principal mezclada) pero cada item lleva ahora también el `slug` de su autor para saber a dónde navegar.

### Nueva ruta `/tecnico/:slug`
- Crear `src/pages/TechnicianProfile.tsx`.
- Registrar la ruta en `src/App.tsx` antes de la catch-all `*`:
  ```
  <Route path="/tecnico/:slug" element={<TechnicianProfile />} />
  ```
- La página lee el `slug` con `useParams`, busca al técnico; si no existe → `<Navigate to="/" />`.

### Diseño de la página de perfil
Estética coherente con la home (minimalista, tipografía fina ya existente):

```text
┌─────────────────────────────────────────┐
│  ← Volver                               │
│                                         │
│  Santiago Guerra                        │
│  Técnico Dental · Guayaquil, Ecuador    │
│                                         │
│  [grid 2/3/4 columnas con sus piezas]   │
└─────────────────────────────────────────┘
```

- Header simple: enlace "← Volver" (usa `Link` de react-router) arriba a la izquierda.
- Bloque de identidad: nombre grande (mantener fuente actual del Hero), debajo línea fina con especialidad + ciudad.
- Galería: misma `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1` con celdas `aspect-square` y `object-cover` que ya usa `TalentShowcase` — se reutilizará el mismo `GalleryItem` exportándolo desde `TalentShowcase.tsx` (o extrayéndolo a `src/components/GalleryItem.tsx` para compartirlo limpio entre los dos contextos).
- En la página de perfil las celdas **no** son clicables (ya estás dentro del perfil).

### Cambio en `TalentShowcase.tsx`
- Envolver cada `GalleryItem` en un `<Link to={`/tecnico/${tech.slug}`}>` para que toda la celda sea clicable.
- Añadir cursor pointer y un sutil scale/opacidad en hover desktop como affordance de "es interactivo" (manteniendo la estética actual, sin exagerar).
- Accesibilidad: el link lleva `aria-label="Ver portafolio de {nombre}"`.

### Comportamiento al navegar
- `useEffect` en `TechnicianProfile` que hace `window.scrollTo(0, 0)` al montar / cambiar slug, para que el perfil empiece arriba.
- Title del documento se actualiza a `{Nombre} — Portafolio` para SEO básico.

## Archivos afectados

**Editado:** `src/data/technicians.ts` — añadir `slug` a cada constante de técnico (`SANTIAGO`, `RAUL`, `RICARDO`, `LUIZ`); exportar helper `getTechnicianBySlug(slug)` que devuelve `{ name, specialty, city, images: string[] }`.

**Nuevo:** `src/components/GalleryItem.tsx` — extraer el componente `GalleryItem` actual de `TalentShowcase.tsx` para reutilizarlo, con prop opcional `linkable` (default true en la home, false en perfil).

**Editado:** `src/components/TalentShowcase.tsx` — importar `GalleryItem` desde el nuevo archivo, envolver en `<Link>`.

**Nuevo:** `src/pages/TechnicianProfile.tsx` — página de perfil con header, bio y galería del técnico.

**Editado:** `src/App.tsx` — registrar ruta `/tecnico/:slug` antes del catch-all.

## Resultado

Cada imagen de la home se vuelve un acceso al portafolio personal del técnico. Navegación limpia, URL compartible (`/tecnico/ricardo-malise`), estética idéntica al resto del sitio.
