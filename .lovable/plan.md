
# Carrito de servicios por técnico

## Qué construir

Convertir la selección de servicios en un **carrito**: el dentista pulsa servicios y se añaden al carrito con **cantidad** (modificable con − / +). Un botón "Solicitar (N)" abre el formulario de subida — pero ahora el formulario gestiona **un caso por unidad** del carrito (cada unidad = un caso individual con su propio paciente y archivos).

## Cambios

### 1. `src/pages/TechnicianProfile.tsx`

**Estado nuevo:**
```ts
type CartItem = { service: Service; quantity: number };
const [cart, setCart] = useState<CartItem[]>([]);
const [checkoutOpen, setCheckoutOpen] = useState(false);
```

**Comportamiento de los chips de servicio:**
- Click en chip → `addToCart(service)`: si ya existe, suma 1; si no, lo añade con `quantity: 1`.
- El chip muestra un badge con la cantidad actual si está en el carrito (pequeño número a la derecha del nombre, estilo `text-foreground/50`).
- El chip queda con borde más oscuro cuando está en el carrito (`border-foreground`).

**Carrito visible (panel sticky abajo):**
- Si `cart.length > 0`, mostrar barra fija inferior (`fixed bottom-0 inset-x-0 border-t border-border bg-background/95 backdrop-blur`).
- Contenido: lista compacta con cada item: nombre del servicio + controles `−` `cantidad` `+` + botón X para eliminar.
- A la derecha: total de unidades + botón **Solicitar (N)** que abre `CaseUploadDialog` en modo checkout.
- Padding-bottom extra en el `<main>` cuando el carrito está visible para que no tape la galería.

Eliminar el estado actual `selectedService` (ya no aplica) — el dialog se controla con `checkoutOpen` + el carrito.

### 2. `src/components/case-upload/CaseUploadDialog.tsx`

**Nueva API:**
```ts
type CartItem = { service: Service; quantity: number };
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  technician: { name: string; city: string };
  onSubmitted?: () => void; // para limpiar el carrito en el padre
};
```

**Lógica:**
- Aplanar el carrito en una lista de "casos individuales": para cada `CartItem`, generar `quantity` entradas. Ej: `[{service: A, qty: 2}, {service: B, qty: 1}]` → `[A#1, A#2, B#1]`.
- Estado: array de `CaseFormData` (uno por caso aplanado), inicializado al abrir el modal.
- UI:
  - Header: "Solicitar {totalCases} caso(s)" + "A {technician.name} · {technician.city}".
  - **Stepper/tabs** sencillo de navegación entre casos: lista vertical a la izquierda (en md+) o tabs arriba (en mobile) con `{Service.name} #{n}` y un check si el caso está completo. En móvil (viewport actual 791px ya es md), usar layout de dos columnas: nav lateral + formulario activo.
  - Solo se muestra el formulario del caso activo. Los campos actuales (paciente, fotos extra/intra, STL, CBCT si implant, notas) van por caso.
  - Indicador de progreso: "X de N casos completos".
- Botón **Enviar** habilitado solo si **todos** los casos son válidos. Al pulsar: `toast.success("N casos enviados (demo)")`, llamar `onSubmitted?.()`, cerrar.

**Helpers internos:**
- `flattenCart(cart): Array<{service: Service, indexInService: number}>`
- `isCaseValid(caseData, isImplant): boolean` (extraer de la validación actual)

### 3. Sin cambios en datos

`services.ts` y `technicians.ts` ya tienen lo necesario.

## Detalles UX

- Chips: cuando están en el carrito, además del borde más oscuro, mostrar la cantidad como `· 2` al lado del nombre, en `text-foreground/50 font-light`.
- Barra de carrito: una línea por item en desktop, scroll horizontal si hay muchos. Botones `−`/`+` redondos pequeños (`h-6 w-6 rounded-full border border-border`).
- Modal de checkout: sidebar de navegación con cada caso listado, el activo destacado con `border-l-2 border-foreground`, los completos con un check `Check` lucide-icon en gris.
- Mantener el lenguaje minimal y `font-light` actual.

## Archivos afectados

- **Editado:** `src/pages/TechnicianProfile.tsx` — añadir carrito, barra inferior, abrir checkout.
- **Editado:** `src/components/case-upload/CaseUploadDialog.tsx` — aceptar carrito, navegación entre casos, validación múltiple, envío.

## Resultado

El dentista pulsa los servicios que quiere, ajusta cantidades en una barra de carrito, y al pulsar "Solicitar (N)" rellena un formulario por cada caso individual antes de enviar todo junto.
