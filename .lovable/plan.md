# Onboarding antes del log in: manual + formulario de aplicación

## Qué construir

Cuando el usuario pulse **"Acceder"** en la pantalla de bienvenida (logo NOMA), en lugar de entrar directamente a la galería se abrirá un **flujo de aplicación en pantalla completa** con varios pasos. Solo después de completar y enviar la solicitud se entra a la web (galería de técnicos).

El flujo simulado (sin validación real) tiene 3 pantallas:

1. **Manual / Bienvenida**: explica qué es NOMA Digital Studio y los pasos para ser parte.
2. **Pregunta de rol**: ¿Eres dentista que busca técnicos, o técnico dental?
3. **Formulario de registro** (campos según el rol).
4. **Pantalla de envío**: "Solicitud recibida. Te contactaremos para aceptarte." → botón **Continuar** que entra a la galería.

## Diseño visual

Mantiene la estética minimal del proyecto: `bg-background`, tipografía `font-light`, separadores finos `border-foreground/20`, sin colores fuertes. Cada paso a pantalla completa con fade entre pasos.

```text
PASO 1 — MANUAL                    PASO 2 — ROL
┌────────────────────────┐         ┌────────────────────────┐
│   [logo pequeño]       │         │   ¿Cómo te unes?       │
│                        │         │                        │
│   Bienvenido a NOMA    │         │  ┌──────────────────┐  │
│                        │         │  │ Soy dentista     │  │
│   Para ser parte:      │         │  │ y busco técnicos │  │
│   1. Completa tu       │         │  └──────────────────┘  │
│      solicitud         │         │  ┌──────────────────┐  │
│   2. Sube tus trabajos │         │  │ Soy técnico      │  │
│   3. Espera aceptación │         │  │ dental           │  │
│                        │         │  └──────────────────┘  │
│       [Continuar]      │         │                        │
└────────────────────────┘         └────────────────────────┘

PASO 3 — FORMULARIO (scroll)        PASO 4 — ENVIADO
┌────────────────────────┐         ┌────────────────────────┐
│   Tu solicitud         │         │   Solicitud recibida   │
│                        │         │                        │
│   [foto perfil ⊕]      │         │   Revisaremos tu       │
│                        │         │   perfil y te          │
│   Nombre completo      │         │   contactaremos por    │
│   Edad                 │         │   email para           │
│   Email                │         │   aceptarte.           │
│   Especialidad         │         │                        │
│   Contraseña           │         │       [Continuar]      │
│   Repetir contraseña   │         └────────────────────────┘
│                        │
│   Trabajos (3-10 fotos)│
│   [⊕ subir fotos]      │
│                        │
│       [Enviar]         │
└────────────────────────┘
```

## Campos del formulario

**Comunes a ambos roles:**
- Foto de perfil (1 imagen, dropzone circular)
- Nombre completo
- Edad
- Email
- Especialidad (texto libre — para dentista: "Estética", "Implantología"…; para técnico: "CAD/CAM", "Cerámica"…)
- Contraseña
- Repetir contraseña (validación: deben coincidir)
- Fotos de trabajos (3 a 10 imágenes, dropzone múltiple)

**Solo para dentista:** etiqueta de especialidad dice "Especialidad odontológica".
**Solo para técnico:** etiqueta dice "Especialidad técnica".

(Los mismos campos para los dos roles, solo cambia el copy. Mantenemos simple).

## Comportamiento

1. Pantalla de bienvenida (logo + Acceder) — **sin cambios**.
2. Al pulsar "Acceder" → se muestra el **flujo de onboarding** (paso 1).
3. El usuario navega Paso 1 → 2 → 3 → 4.
4. En el paso 3, validaciones mínimas en cliente:
   - Todos los campos obligatorios.
   - Email con formato válido.
   - Contraseñas coinciden, mínimo 6 caracteres.
   - Mínimo 1 foto de perfil y 3 de trabajos.
   - Si falla, muestra mensaje rojo sutil debajo del campo.
5. Al pulsar **Enviar** en paso 3 → pasa al paso 4 (no hay backend, es simulado).
6. En paso 4, **Continuar** → entra a la web (galería).
7. **Sin persistencia**: al recargar la página, vuelve a empezar por el logo + Acceder.
8. Hay un botón **"Atrás"** sutil en pasos 2, 3, 4 para volver al paso anterior. En paso 1, "Atrás" vuelve a la pantalla del logo.

## Detalles técnicos

- **Nuevo:** `src/components/onboarding/OnboardingFlow.tsx`
  - Props: `onComplete: () => void`, `onBack: () => void`.
  - Estado interno: `step` (1-4), `role` ("dentist" | "technician" | null), `formData` (objeto con todos los campos), `errors` (record con mensajes por campo), `profilePhoto` (File | null), `workPhotos` (File[]).
  - Renderiza 4 sub-componentes según `step`.
  - Transición fade entre pasos (mismo patrón que `WelcomeScreen`).

- **Nuevo:** `src/components/onboarding/OnboardingManual.tsx` — paso 1 (texto + botón Continuar).
- **Nuevo:** `src/components/onboarding/OnboardingRole.tsx` — paso 2 (dos botones grandes).
- **Nuevo:** `src/components/onboarding/OnboardingForm.tsx` — paso 3 (formulario completo).
  - Usa `react-hook-form` + `zod` (ya en el stack) para validación.
  - Schema zod: `nombre` ≥ 2 chars y ≤ 100, `edad` número 18-99, `email` válido, `especialidad` ≥ 2 chars, `password` ≥ 6 chars, `passwordRepeat` debe igualar `password` (`.refine`).
  - Dropzones reutilizan el patrón de `src/components/case-upload/FileDropzone.tsx`.
  - Una zona circular para foto de perfil; otra rectangular múltiple para trabajos (con preview en grid).
- **Nuevo:** `src/components/onboarding/OnboardingSubmitted.tsx` — paso 4 (confirmación + Continuar).

- **Editado:** `src/pages/Index.tsx`
  - Reemplazar el booleano `entered` por un estado `phase`: `"welcome" | "onboarding" | "app"`.
  - `WelcomeScreen.onEnter` → `setPhase("onboarding")`.
  - `OnboardingFlow.onComplete` → `setPhase("app")`.
  - `OnboardingFlow.onBack` (en paso 1) → `setPhase("welcome")`.

- **Sin cambios** en Header, Hero, TalentShowcase, rutas internas (`/tecnico/:slug` sigue siendo accesible directo por URL sin pasar por el onboarding — solo `/` muestra el flujo).

- **Sin backend / sin almacenamiento real**: las imágenes se manejan como `File` en memoria, los datos del formulario no se envían a ningún sitio. Es puramente visual, como pidió el usuario para el log in simulado.

## Archivos afectados

- **Nuevos:**
  - `src/components/onboarding/OnboardingFlow.tsx`
  - `src/components/onboarding/OnboardingManual.tsx`
  - `src/components/onboarding/OnboardingRole.tsx`
  - `src/components/onboarding/OnboardingForm.tsx`
  - `src/components/onboarding/OnboardingSubmitted.tsx`
- **Editado:**
  - `src/pages/Index.tsx` (estado `phase` con 3 fases en vez de boolean).

## Resultado

Al pulsar "Acceder" en el logo, en vez de entrar directo, se ve un manual breve, una pregunta de rol, y un formulario de aplicación con todos los campos pedidos (foto de perfil, nombre, edad, email, especialidad, contraseña x2, fotos de trabajos). Tras enviar, se muestra "Solicitud recibida — te contactaremos" y un botón Continuar que finalmente entra a la galería.
