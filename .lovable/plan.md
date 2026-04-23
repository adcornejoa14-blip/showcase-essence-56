
# Foto de perfil + galería completa por técnico

## Qué hacer

Al abrir el portafolio de un técnico (`/technician/:slug`), debe verse:

1. **Foto de perfil** arriba: la imagen marcada como `isPerson: true` (el retrato real del técnico).
2. **Galería completa debajo**: todas las imágenes de trabajo de ese técnico — sin recortar, sin filtrar — en el mismo orden en el que están listadas en `src/data/technicians.ts`.

Hoy `getTechnicianBySlug` ya reordena para poner el retrato primero, pero el retrato aparece como una pieza más de la galería. Se quiere separarlo visualmente como "foto de perfil" y mostrar el resto como galería.

## Cambios

### 1. `src/data/technicians.ts` — `getTechnicianBySlug`

Devolver dos colecciones en lugar de una sola lista mezclada:

```ts
{
  technician: { slug, name, country, ... },
  profileImage: ImageItem | undefined, // la que tiene isPerson: true
  gallery: ImageItem[]                  // todas las demás, en orden original
}
```

Si por alguna razón no hay retrato (`isPerson`), `profileImage` queda `undefined` y la galería incluye todo.

### 2. `src/pages/TechnicianProfile.tsx`

Reordenar el render:

- **Header del perfil** (ya existente: nombre, país, etc.) — sin cambios estructurales.
- **Bloque de foto de perfil** nuevo, justo bajo el header:
  - Imagen circular o cuadrada redondeada, centrada, tamaño moderado (≈`w-40 h-40 md:w-56 md:h-56`), `object-cover`, sombra sutil.
  - Si `profileImage` no existe, no se renderiza el bloque.
- **Galería** debajo: misma cuadrícula que ya hay, pero alimentada por `gallery` (sin el retrato, para no duplicarlo).

Mantener la tipografía Poppins, espaciados y estilo visual actuales — no se introduce ningún color ni componente nuevo.

## Archivos afectados

- `src/data/technicians.ts` — ajustar el shape devuelto por `getTechnicianBySlug`.
- `src/pages/TechnicianProfile.tsx` — separar foto de perfil de la galería; pasar la lista completa al grid.

## Resultado

Al pulsar una imagen y entrar al perfil del técnico, su retrato aparece destacado como foto de perfil y debajo se ve la galería con **todas** sus piezas de trabajo, sin omisiones.
