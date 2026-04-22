
# Portfolio final: 4 técnicos con nombre, especialidad y ciudad visibles

## Los 4 técnicos confirmados (datos reales)

1. **Santiago Guerra** — Técnico Dental · Guayaquil, Ecuador
2. **Raúl Guerra** — Técnico Dental · Guayaquil, Ecuador
3. **Ricardo Malise** — Técnico Dental · Praia Brava, Brasil
4. **Luiz Varelas** — Técnico Dental · Praia Brava, Brasil

Mantengo el campo `city` en el tipo `Technician` (lo había propuesto quitar — ahora se queda porque añade contexto real al portfolio internacional Ecuador/Brasil).

## Reparto de las 12 piezas (3 por técnico)

**Santiago Guerra** (Guayaquil, Ecuador)
- cad-implante.jpg
- scan-superior.png
- cad-arcada-pilar.jpg (IMG_1003_2 — nueva)

**Raúl Guerra** (Guayaquil, Ecuador)
- ceramica-macro.jpg
- wax-up-firma.jpg
- wax-up-lineas.jpg (IMG_0999_2 — nueva)

**Ricardo Malise** (Praia Brava, Brasil)
- pilar-implante.jpg
- tecnico-lupa.jpg
- coronas-opal.jpg (IMG_1017 — nueva)

**Luiz Varelas** (Praia Brava, Brasil)
- arcada-pulida.jpg
- arcada-brillante.jpg (IMG_1018 — nueva)
- tecnico-pincel.jpg (IMG_1019 — nueva)

Orden mezclado en el masonry para que las piezas del mismo técnico no aparezcan consecutivas (Ecuador y Brasil intercalados).

Las imágenes que no entran en esta selección final (`tecnico-pinzas.jpg`, `dos-tecnicos.jpg` y los uploads no usados) quedan sin referenciar — los archivos siguen en `src/assets/gallery/` por si los quieres rescatar luego, pero no aparecen en la galería.

## Etiqueta visible permanente en cada imagen

Modifico `src/components/TalentShowcase.tsx`:

- Etiqueta fija en `bottom-2 left-2` con **nombre del técnico** siempre visible.
- Fondo `bg-foreground/55` + `backdrop-blur-sm`, `rounded-sm`, padding `px-2.5 py-1`.
- Tipografía blanca fina, `text-[11px]` móvil / `text-xs` desktop, `tracking-wide`.
- En **hover desktop**: la etiqueta se expande con animación suave mostrando especialidad ("Técnico Dental") y ciudad ("Guayaquil, Ecuador" / "Praia Brava, Brasil") debajo del nombre.
- En **móvil**: solo nombre visible permanente — sin degradado oscuro grande (se elimina el actual para una estética más limpia).

## Archivos afectados

**Nuevos assets a copiar a `src/assets/gallery/`:**
- `cad-arcada-pilar.jpg` (de IMG_1003_2.jpg)
- `wax-up-lineas.jpg` (de IMG_0999_2.jpg)
- `coronas-opal.jpg` (de IMG_1017.jpg)
- `arcada-brillante.jpg` (de IMG_1018.jpg)
- `tecnico-pincel.jpg` (de IMG_1019.jpg)

**Editado:** `src/data/technicians.ts` — 12 entradas con solo 4 nombres únicos (Santiago Guerra, Raúl Guerra, Ricardo Malise, Luiz Varelas), todos con `specialty: "Técnico Dental"` y su ciudad real, en orden mezclado.

**Editado:** `src/components/TalentShowcase.tsx` — etiqueta permanente con nombre, expansión a especialidad + ciudad en hover desktop, sin degradado oscuro en móvil.

## Resultado

Galería masonry limpia que comunica: 4 técnicos dentales reales, 2 en Ecuador y 2 en Brasil, con su trabajo identificado de un vistazo sin necesidad de hover. Estética minimalista mantenida.
