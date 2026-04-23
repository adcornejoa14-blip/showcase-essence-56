
# Agrupar por paciente: cantidad = piezas, no casos

## Problema

Hoy: si el dentista pide 4 carillas, debe rellenar 4 fichas con paciente/fotos/STL repetidos. La cantidad debería representar **número de piezas para el mismo paciente**, no casos independientes.

## Cambio de modelo

- **Servicios "por pieza"** (carillas, coronas anteriores, mock-up, wax-up, inlays, onlays, overlays, surgical guide + crown): la `quantity` del carrito = número de piezas → **una sola ficha por servicio**, con un campo extra "Piezas (FDI)" donde se listan los dientes.
- **Servicios "por caso"** (surgical guide solo): la `quantity` sigue significando casos independientes → una ficha por unidad como ahora.

Helper nuevo en `src/lib/caseRequirements.ts`:
```ts
// Servicios donde la cantidad = piezas del mismo paciente
export const isPerToothService = (slug: string): boolean => {
  const perTooth = [
    "cadcam-veneers", "cadcam-crown-anterior", "mockup-dsd", "wax-up",
    "inlays", "onlays", "overlays", "surgical-guide-crown",
  ];
  return perTooth.includes(slug);
};
```

## Cambios en `src/components/case-upload/CaseUploadDialog.tsx`

### Nuevo `flattenCart`
```ts
// Si el servicio es "por pieza" → 1 entrada con toothCount = quantity
// Si es "por caso" → N entradas con toothCount = 1
const flattenCart = (cart) => {
  const out = [];
  for (const item of cart) {
    if (isPerToothService(item.service.slug)) {
      out.push(newCase(item.service, 1, item.quantity)); // 1 ficha, N piezas
    } else {
      for (let i = 0; i < item.quantity; i++) {
        out.push(newCase(item.service, i + 1, 1));
      }
    }
  }
  return out;
};
```

### `CaseFormData` añade
- `toothCount: number` (informativo, viene del carrito)
- `toothNumbers: string` (input controlado por el usuario, p. ej. "11, 21, 22, 23")

### UI
- En la sección "Paciente", añadir bajo el nombre:
  - Texto informativo: "Piezas a tratar: **{toothCount}**" cuando `isPerToothService`.
  - Input requerido "Numeración FDI de las piezas" (ej. `11, 21, 22, 23`) — placeholder con ejemplo, validación: al menos `toothCount` valores separados por coma.
- Etiqueta del sidebar:
  - Por pieza: `{Service.name} · {toothCount} piezas` (sin `#n`)
  - Por caso: `{Service.name} #{n}` como ahora
- Cabecera del formulario activo igual.

### Validación
`isCaseValid` añade:
```ts
const teeth = c.toothNumbers.split(",").map(s => s.trim()).filter(Boolean);
const toothOk = !isPerToothService(c.service.slug) || teeth.length >= c.toothCount;
```

### Header del modal
"Solicitar {totalCases} ficha(s)" en lugar de "caso(s)" — refleja que pueden agrupar varias piezas.

## Cambios en `src/pages/TechnicianProfile.tsx`

Sin cambios estructurales del carrito: la `quantity` ya existe. Solo ajustar el texto del botón:
- "Solicitar (N piezas/casos)" → mantener "Solicitar (N)" pero el tooltip/copy interno del modal explica la diferencia.

Opcional (mejora ligera): en la barra del carrito, junto a cada item mostrar `· por pieza` o `· por caso` en `text-foreground/40 text-xs`, para que el dentista entienda qué significa la cantidad antes de abrir el modal.

## Resultado

- 4 carillas para Juan Pérez → 1 ficha con `toothCount=4`, el dentista escribe `11, 12, 21, 22` y sube **una sola vez** fotos + STL.
- 2 surgical guides (pacientes distintos) → 2 fichas independientes como hasta ahora.
- Mezcla: 4 carillas + 2 surgical guides → 1 ficha de carillas + 2 fichas de guías = 3 entradas en el sidebar.

## Archivos afectados

- **Editado:** `src/lib/caseRequirements.ts` — añadir `isPerToothService`.
- **Editado:** `src/components/case-upload/CaseUploadDialog.tsx` — nuevo flatten, `toothCount`/`toothNumbers`, validación, etiquetas.
- **Editado (opcional):** `src/pages/TechnicianProfile.tsx` — anotación "por pieza"/"por caso" en el carrito.
