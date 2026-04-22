
# Foto del técnico primero, Poppins global y nombre sin fondo

## 1. Foto de la persona primero en cada perfil

En `src/data/technicians.ts`, marcar con `isPerson: true` las 4 fotos retrato:
- Santiago → `dos-tecnicos-lampara.jpg`
- Raúl → `tecnico-trabajando.jpg`
- Ricardo → `tecnico-lupa-2.jpg`
- Luiz → `tecnico-pincel.jpg`

En `getTechnicianBySlug`, ordenar el array `images` poniendo primero las marcadas `isPerson` y después el resto en su orden actual. La galería de la home **no cambia** — solo el perfil individual.

## 2. Tipografía Poppins en todo el sitio

- `index.html`: añadir `<link>` a Google Fonts (Poppins, pesos 300/400/500/600/700) con `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`.
- `tailwind.config.ts`: extender `theme.fontFamily.sans` con Poppins primero + fallback system stack. Todo el sitio hereda Poppins automáticamente.

## 3. Quitar fondo a la etiqueta del nombre

En `src/components/GalleryItem.tsx`:
- Eliminar `bg-foreground/55`, `backdrop-blur-sm`, padding y `rounded` de la cápsula del nombre.
- Dejar solo el texto blanco con Poppins fina.
- Añadir `text-shadow` sutil (`[text-shadow:_0_1px_3px_rgb(0_0_0_/_0.7)]`) para legibilidad sobre imágenes claras.
- Mantener el degradado inferior suave en móvil (ya existente) como apoyo de contraste.

## Archivos afectados

- `src/data/technicians.ts` — flag `isPerson` + reordenado en helper.
- `index.html` — link a Poppins.
- `tailwind.config.ts` — `fontFamily.sans` con Poppins.
- `src/components/GalleryItem.tsx` — etiqueta sin fondo, solo texto con sombra.

## Resultado

Al abrir el portafolio de un técnico, su retrato aparece primero. Toda la web usa Poppins. El nombre del técnico flota directamente sobre la imagen, sin caja, manteniendo el look minimalista.
