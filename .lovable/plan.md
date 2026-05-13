## Añadir dos campos nuevos al formulario "Create an account"

En `src/components/onboarding/OnboardingForm.tsx`, agregar **dos campos independientes** después de "Specialty":

### 1. Why do you want to be part of NOMA?
- Textarea (multilínea, 3 filas, `resize-none`).
- **Obligatorio** — mínimo 20 caracteres.
- Placeholder: "Tell us briefly what motivates you to join NOMA…"
- Error: "Tell us a bit more (min. 20 characters)."

### 2. Who recommends you?
- Input de una línea, **separado** del anterior (su propio label y bloque).
- **Opcional** — sin validación si está vacío.
- Placeholder: "Name of the person who recommends you (optional)"

### Detalles técnicos
- Nuevo estado: `motivation`, `referrer`.
- Extender el tipo `Errors` con `motivation`.
- Añadir validación de `motivation` en `validate()`.
- Reutilizar la clase `fieldClass` (estilo minimal con borde inferior) para ambos.
- Mantener todo el copy en inglés, consistente con el resto del formulario.

### Fuera de alcance
- No se persisten en la base de datos todavía (igual que el resto de campos del formulario actual).
- No se tocan otros pasos del onboarding.
