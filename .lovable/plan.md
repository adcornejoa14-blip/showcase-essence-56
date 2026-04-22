
# Reemplazar imágenes de la galería con tus fotos reales

## Qué se hace
Sustituyo los 10 placeholders de Unsplash por las 9 fotos que acabas de subir, mostradas en **orden aleatorio** (mezcladas, no en el orden en que las subiste) para que la galería tenga un ritmo visual más natural — render CAD junto a foto de taller junto a macro de cerámica, etc.

## Pasos concretos

**1. Copiar las imágenes al proyecto**
Las 9 imágenes pasan de `user-uploads://` a `src/assets/gallery/`:
- `Screenshot_2026-04-22_at_4.22.01_PM.png` → `scan-superior.png`
- `IMG_0998.jpg` → `ceramica-macro.jpg`
- `IMG_0999.jpg` → `wax-up-firma.jpg`
- `IMG_1003.jpg` → `cad-implante.jpg`
- `IMG_1004.jpg` → `pilar-implante.jpg`
- `IMG_1005.jpg` → `tecnico-pinzas.jpg`
- `IMG_1006.jpg` → `dos-tecnicos.jpg`
- `IMG_1007.jpg` → `arcada-pulida.jpg`
- `IMG_1010.jpg` → `tecnico-lupa.jpg`

**2. Reescribir `src/data/technicians.ts`**
- Importar las 9 imágenes como módulos ES6 (`import x from "@/assets/gallery/..."`) para que Vite las optimice.
- Mantener la estructura `{ image, name, specialty, city }` para que el componente `TalentShowcase` siga funcionando sin cambios.
- Asignar nombre/especialidad/ciudad coherentes con lo que muestra cada imagen:
  - Fotos de personas trabajando → técnicos reales (con nombre + ciudad)
  - Renders CAD / macros de cerámica / escaneos → atribuidos como "trabajo de" un técnico con su especialidad concreta (Diseño CAD/CAM, Estética Dental, Coronas Zirconio, Implantología, etc.)
- **Orden desordenado a propósito**: la secuencia en el array mezcla tipos (render → foto humana → macro → escaneo → render…) para romper monotonía visual en el masonry.

**3. Sin tocar componentes**
`TalentShowcase.tsx` y `Hero.tsx` no se modifican — solo cambia la fuente de datos.

## Resultado
Galería masonry con tus 9 piezas reales, mezcladas, cada una con su tarjeta de hover (nombre + especialidad + ciudad). Si más adelante quieres ajustar nombres reales de técnicos o reordenar manualmente, se hace editando solo `technicians.ts`.

## Pendiente de tu parte (opcional)
Si quieres que algún nombre/especialidad/ciudad concretos vayan asociados a una imagen específica (porque conoces al autor real de cada pieza), pásamelo y lo ajusto. Si no, uso atribuciones plausibles para el portfolio inicial.
