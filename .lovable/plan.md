
# Reducir galería de la home a 12 imágenes (con todos los retratos)

## Qué cambiar

La galería principal (`TalentShowcase`) muestra actualmente 17 imágenes. Reducir a **12** asegurando que **las 4 fotos de personas** estén incluidas (una por técnico) y completar con 8 piezas de trabajo, manteniendo el orden mezclado (Ecuador/Brasil intercalados, sin dos consecutivas del mismo técnico).

## Selección (12 imágenes)

Las 4 fotos retrato (obligatorias):
- `dos-tecnicos-lampara` (Santiago)
- `tecnico-trabajando` (Raúl)
- `tecnico-lupa-2` (Ricardo)
- `tecnico-pincel` (Luiz)

8 piezas de trabajo (2 por técnico para equilibrio):
- Santiago: `arcada-cera`, `coronas-centrales`
- Raúl: `cad-arcada-amarillo`, `wax-up-detalle`
- Ricardo: `ceramica-rosa`, `arcada-superior`
- Luiz: `cad-arcada-pilar`, `arcada-brillante`

Orden propuesto (intercalando autores y países, sin repetir técnico consecutivo):

1. `arcada-cera` — Santiago
2. `cad-arcada-pilar` — Luiz
3. `tecnico-lupa-2` — Ricardo (persona)
4. `cad-arcada-amarillo` — Raúl
5. `dos-tecnicos-lampara` — Santiago (persona)
6. `ceramica-rosa` — Ricardo
7. `wax-up-detalle` — Raúl
8. `tecnico-pincel` — Luiz (persona)
9. `coronas-centrales` — Santiago
10. `arcada-superior` — Ricardo
11. `tecnico-trabajando` — Raúl (persona)
12. `arcada-brillante` — Luiz

Resultado en grid: 4 columnas × 3 filas en desktop, 2 columnas × 6 filas en móvil — rejilla perfectamente cuadrada y completa, sin huecos.

## Archivo afectado

- `src/data/technicians.ts` — recortar el array `technicians` a estas 12 entradas en el orden indicado. Las imágenes eliminadas del array siguen importadas/usadas por `getTechnicianBySlug`, así que los **perfiles individuales no pierden contenido** — solo cambia lo que se ve en la home.

## Resultado

Home más curada: 12 piezas, los 4 retratos presentes y repartidos, rejilla limpia. Los portafolios individuales mantienen todas las fotos de cada técnico.
