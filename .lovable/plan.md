
# Alinear todas las imágenes para que terminen al mismo nivel inferior

## Problema

Ahora la galería usa CSS `columns` (masonry vertical). Cada columna tiene altura distinta porque las imágenes apilan diferente, así que el borde inferior de la galería queda dentado: una columna acaba más abajo que otra.

## Solución

Cambiar de `columns` a **CSS Grid con filas iguales y `object-cover`**, para que todas las imágenes:
- Compartan la misma altura por fila.
- La galería termine en una línea recta abajo.
- Se mantenga la estética compacta sin huecos.

## Cambios en `src/components/TalentShowcase.tsx`

Reemplazar el contenedor:

```tsx
<div className="columns-2 gap-1 md:columns-3 md:gap-1 lg:columns-4">
```

Por una grid uniforme:

```tsx
<div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
```

Y en `GalleryItem`:
- Quitar `break-inside-avoid` y `mb-1` (ya no aplica con grid).
- Envolver la imagen en un contenedor con `aspect-square` (proporción 1:1, todas las celdas idénticas).
- La imagen pasa a `h-full w-full object-cover` para rellenar la celda recortando lo que sobre.

Resultado: rejilla perfecta, todas las filas alineadas, borde inferior recto. La etiqueta de hover y el degradado móvil se mantienen igual.

## Alternativa que descarto

Mantener masonry y forzar igualar columnas con JS sería frágil y reordenaría imágenes. La grid cuadrada es más predecible y profesional para un portfolio.

## Archivo afectado

- `src/components/TalentShowcase.tsx` — cambiar contenedor a grid + envolver cada imagen en celda `aspect-square` con `object-cover`.
