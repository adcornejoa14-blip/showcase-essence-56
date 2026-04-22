
# Asignar fotos correctas a cada técnico + nombre solo en hover

## Lo que entiendo

Dos correcciones al estado actual:

1. **Asignación de fotos por técnico está mal**: Las imágenes que subiste estaban agrupadas por técnico (cada tanda de uploads pertenecía al técnico que mencionaste justo antes), pero las repartí mezclando autores. Hay que reasignar según el orden real de envío.

2. **El nombre debe aparecer solo en hover**, no permanente. Recuperar el comportamiento anterior: imagen limpia por defecto, etiqueta con nombre + especialidad + ciudad aparece al pasar el ratón. Mantener la tipografía fina actual.

## Asignación correcta según el orden en que enviaste las fotos

**Santiago Guerra Goes** (Técnico Dental, Guayaquil, Ecuador) — primer nombre que diste, le corresponden las 3 fotos subidas en ese mensaje:
- `arcada-cera` (Screenshot_37.png — escaneo arcada con cera)
- `dos-tecnicos-lampara` (IMG_1006-2.jpg — dos técnicos bajo lámpara)
- `coronas-centrales` (Screenshot_2026-04-22_at_4.24.19_PM.png — render dos coronas)

**Raúl Guerra Goes** (Técnico Dental, Guayaquil, Ecuador) — segundo nombre, 4 fotos:
- `cad-arcada-amarillo` (IMG_1005-2.jpg)
- `wax-up-detalle` (IMG_1004-2.jpg)
- `tecnico-trabajando` (IMG_1007-2.jpg)
- `arcada-render` (Screenshot_2026-04-22_at_4.22.01_PM-2.png)

**Ricardo Malise** (Técnico Dental, Praia Brava, Brasil) — tercer nombre, 5 fotos:
- `tecnico-lupa-2` (IMG_1010_2.jpg)
- `ceramica-rosa` (IMG_1011.jpg)
- `coronas-opalescencia` (IMG_1012.jpg)
- `arcada-superior` (IMG_1013.jpg)
- `corona-pilar` (IMG_1014.jpg)

**Luiz Varelas** (Técnico Dental, Praia Brava, Brasil) — cuarto nombre, 5 fotos:
- `cad-arcada-pilar` (IMG_1003_2.jpg — ya en proyecto)
- `wax-up-lineas` (IMG_0999_2.jpg — ya en proyecto, hay que renombrar autoría)
- `tecnico-pincel` (IMG_1019.jpg — ya en proyecto)
- `arcada-brillante` (IMG_1018.jpg — ya en proyecto)
- `coronas-opal` (IMG_1017.jpg — ya en proyecto)

**Total: 17 piezas** (todas las que enviaste, ninguna descartada).

Las fotos antiguas de Unsplash que aún figuran en `technicians.ts` (`cad-implante`, `scan-superior`, `ceramica-macro`, `wax-up-firma`, `pilar-implante`, `tecnico-lupa`, `arcada-pulida`) **se eliminan de la galería** porque no son trabajo real de los técnicos — el portfolio queda 100% con tus fotos.

## Orden mezclado en el masonry

17 piezas intercaladas para que no aparezcan dos del mismo técnico seguidas, alternando además Ecuador y Brasil:

Santiago → Luiz → Raúl → Ricardo → Santiago → Luiz → Raúl → Ricardo → Santiago → Luiz → Raúl → Ricardo → Luiz → Ricardo → Raúl → Ricardo → Luiz

## Cambio en `TalentShowcase.tsx`: nombre solo en hover

Volver al comportamiento anterior:
- **Por defecto**: imagen limpia, sin etiqueta visible.
- **Hover desktop**: aparece la etiqueta con `bg-foreground/55` + `backdrop-blur-sm` en `bottom-2 left-2`, mostrando **nombre + especialidad + ciudad** con la misma tipografía fina actual (`text-[11px]`/`text-xs`, `tracking-wide`, white).
- **Móvil (sin hover real)**: la etiqueta aparece con un degradado suave inferior — solo nombre, ya que en táctil no hay hover. Animación de entrada al hacer scroll igual que ahora.

Tipografía y colores idénticos a los que ya tenías antes del cambio permanente — no se introduce ninguna fuente nueva.

## Archivos afectados

**Nuevos assets a copiar a `src/assets/gallery/`** (8 imágenes pendientes de los uploads anteriores):
- `arcada-cera.png`, `dos-tecnicos-lampara.jpg`, `coronas-centrales.png` (Santiago)
- `cad-arcada-amarillo.jpg`, `wax-up-detalle.jpg`, `tecnico-trabajando.jpg`, `arcada-render.png` (Raúl)
- `tecnico-lupa-2.jpg`, `ceramica-rosa.jpg`, `coronas-opalescencia.jpg`, `arcada-superior.jpg`, `corona-pilar.jpg` (Ricardo)

**Editado:** `src/data/technicians.ts` — 17 entradas con autoría correcta según orden de envío, mezcladas.

**Editado:** `src/components/TalentShowcase.tsx` — etiqueta vuelve a aparecer solo en hover (desktop) o con degradado suave (móvil), tipografía fina anterior.

## Resultado

Galería limpia de 17 piezas reales, cada técnico con sus propias fotos asignadas correctamente. Estética minimalista: la imagen habla por sí sola y el nombre del autor aparece al interactuar.
