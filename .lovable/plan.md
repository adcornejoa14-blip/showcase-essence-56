
# Selector visual de piezas dentales (FDI)

## Qué construir

Sustituir el input de texto "Numeración FDI" por un **selector visual interactivo** tipo odontograma: muestra los 32 dientes adultos en forma de arcada (superior + inferior), el dentista hace clic en cada pieza para seleccionarla/deseleccionarla. Las piezas seleccionadas se resaltan (borde rojo + fondo destacado, como en la imagen de referencia).

## Componente nuevo: `src/components/case-upload/ToothSelector.tsx`

**Props:**
```ts
type Props = {
  value: string[];        // ["11", "21", "22"]
  onChange: (teeth: string[]) => void;
  maxCount?: number;      // toothCount del caso (informativo)
};
```

**Estructura visual** (forma ovalada tipo arcada, similar a la imagen):

```text
        Arcada superior (FDI 18→11, 21→28)
   18 17 16 15 14 13 12 11 | 21 22 23 24 25 26 27 28
                          ◯
                       (centro)
   48 47 46 45 44 43 42 41 | 31 32 33 34 35 36 37 38
        Arcada inferior (FDI 48→41, 31→38)
```

- Layout: dos filas centradas (arcada superior arriba, inferior abajo) con un pequeño separador.
- En desktop: arco curvado usando `grid` + leve `translateY` por posición para simular curvatura. En mobile (<640px): dos filas rectas, sin curvatura, scroll horizontal si no cabe.
- Cada diente = botón cuadrado `w-8 h-8 md:w-10 md:h-10 rounded-md border` con el número FDI dentro en `text-[10px] font-light`.
- Estados:
  - Por defecto: `border-border bg-muted/20 text-foreground/50`
  - Hover: `border-foreground/40`
  - Seleccionado: `border-foreground bg-foreground/10 text-foreground` + ring sutil (siguiendo el lenguaje minimal del proyecto, sin rojos nuevos).
- Línea media vertical sutil entre cuadrante 1 y 2 (y entre 4 y 3) con `border-l border-border/50`.

**Comportamiento:**
- Click en diente → toggle en `value` (añade o quita el FDI).
- Mostrar contador debajo: "{value.length} de {maxCount} piezas seleccionadas" en `text-xs font-light text-foreground/60`. Si `value.length < maxCount` → texto en `text-foreground/80`. Si `>= maxCount` → check sutil verde-grisáceo.
- Botón pequeño "Limpiar" a la derecha del contador.

**Datos:**
```ts
const UPPER_RIGHT = ["18","17","16","15","14","13","12","11"];
const UPPER_LEFT  = ["21","22","23","24","25","26","27","28"];
const LOWER_LEFT  = ["31","32","33","34","35","36","37","38"];
const LOWER_RIGHT = ["48","47","46","45","44","43","42","41"];
```

## Cambios en `src/components/case-upload/CaseUploadDialog.tsx`

- Cambiar el campo `toothNumbers` de `string` a `string[]` en `CaseFormData`.
- Reemplazar el `<Input>` actual de "Numeración FDI" por:
  ```tsx
  <ToothSelector
    value={active.toothNumbers}
    onChange={(teeth) => updateActive({ toothNumbers: teeth })}
    maxCount={active.toothCount}
  />
  ```
- Actualizar `parseTeeth` (eliminar, ya no hace falta) y `isCaseValid`:
  ```ts
  const toothOk = !perTooth || c.toothNumbers.length >= c.toothCount;
  ```
- Inicializar `toothNumbers: []` en `newCase`.

## Detalles UX

- Mantener tipografía y bordes del proyecto (`font-light`, `border-border`, sin colores nuevos — siguiendo el patrón minimal monocromo actual, no el rojo de la imagen de referencia que es solo inspiración de interacción).
- Etiqueta encima del selector: "Selecciona las {toothCount} piezas a tratar *".
- Tooltip opcional al hover de cada diente con el nombre (ej. "11 — Incisivo central superior derecho") — usando `<Tooltip>` de shadcn ya disponible.
- Responsive: en el viewport actual (791px) entra cómodamente en 2 filas de 16 cuadrados de 32px.

## Archivos afectados

- **Nuevo:** `src/components/case-upload/ToothSelector.tsx`
- **Editado:** `src/components/case-upload/CaseUploadDialog.tsx` — usar el selector, cambiar tipo de `toothNumbers` a `string[]`, ajustar validación.

## Resultado

El dentista ve una arcada dental completa y simplemente hace clic en las piezas que quiere tratar. Sin escribir comas ni recordar la nomenclatura FDI. Validación visual inmediata del progreso ("3 de 4 seleccionadas").
