# Dos opciones en la pantalla de bienvenida: Crear cuenta + Iniciar sesión

## Qué construir

En la pantalla del logo, sustituir el botón único **"Acceder"** por **dos botones**:

- **Crear cuenta** → abre el flujo de onboarding actual (manual + rol + formulario + confirmación).
- **Iniciar sesión** → abre una nueva pantalla con un formulario simple de email + contraseña para usuarios que ya tienen cuenta.

Ambos flujos son simulados (sin backend), igual que el resto del log in actual.

## Diseño

```text
PANTALLA LOGO                       PANTALLA LOGIN
┌────────────────────────┐          ┌────────────────────────┐
│                        │          │   [logo pequeño]       │
│   [   LOGO NOMA   ]    │          │                        │
│                        │          │   Iniciar sesión       │
│                        │          │                        │
│  ┌──────────┐ ┌──────┐ │          │   Email                │
│  │  Crear   │ │ Log  │ │          │   ───────────────      │
│  │  cuenta  │ │ in   │ │          │   Contraseña           │
│  └──────────┘ └──────┘ │          │   ───────────────      │
│                        │          │                        │
└────────────────────────┘          │       [ Entrar ]       │
                                    │                        │
                                    │  Atrás   ¿Sin cuenta?  │
                                    └────────────────────────┘
```

Estética minimal del proyecto: `bg-background`, `font-light`, bordes sutiles `border-foreground/20`, mismas proporciones que el botón actual. En móvil los dos botones se apilan verticalmente; en desktop quedan lado a lado.

## Comportamiento

1. Pantalla del logo con dos botones.
2. **Crear cuenta** → entra al flujo de onboarding existente (sin cambios en él).
3. **Iniciar sesión** → entra a la pantalla de login.
4. En login: email + contraseña. Validación mínima en cliente (email con formato válido, contraseña ≥ 6 chars). Sin verificar credenciales reales — al pulsar **Entrar** entra a la galería.
5. En login hay un enlace **"¿No tienes cuenta? Crear cuenta"** que lleva al onboarding, y un botón **Atrás** que vuelve a la pantalla del logo.
6. Sin persistencia: cada recarga vuelve a empezar por la pantalla del logo (igual que ahora).

## Detalles técnicos

- **Editado:** `src/components/WelcomeScreen.tsx`
  - Cambiar props: `onEnter` → `onCreateAccount: () => void` y `onLogin: () => void`.
  - Renderizar dos botones en un contenedor flex (`flex-col` en móvil, `sm:flex-row` en desktop).
  - Mantener el fade-out al pulsar cualquiera de los dos.

- **Nuevo:** `src/components/onboarding/LoginScreen.tsx`
  - Props: `onLogin: () => void`, `onBack: () => void`, `onCreateAccount: () => void`.
  - Estado local: `email`, `password`, `error`.
  - Mismos estilos minimal que `OnboardingForm` (inputs con `border-b`, sin caja).
  - Validación: regex de email, password ≥ 6 chars. Si falla muestra mensaje rojo bajo el formulario.
  - Botón principal **Entrar** que llama a `onLogin()` si pasa la validación.
  - Pie con **Atrás** (a la izquierda) y enlace a **Crear cuenta** (a la derecha).

- **Editado:** `src/pages/Index.tsx`
  - Ampliar `Phase` a `"welcome" | "onboarding" | "login" | "app"`.
  - `WelcomeScreen.onCreateAccount` → `setPhase("onboarding")`.
  - `WelcomeScreen.onLogin` → `setPhase("login")`.
  - `LoginScreen.onLogin` → `setPhase("app")`.
  - `LoginScreen.onBack` → `setPhase("welcome")`.
  - `LoginScreen.onCreateAccount` → `setPhase("onboarding")`.

- **Sin cambios** en el flujo de onboarding (`OnboardingFlow`, `OnboardingManual`, `OnboardingRole`, `OnboardingForm`, `OnboardingSubmitted`), Header, Hero, TalentShowcase, ni rutas internas.

## Archivos afectados

- **Editado:** `src/components/WelcomeScreen.tsx`
- **Nuevo:** `src/components/onboarding/LoginScreen.tsx`
- **Editado:** `src/pages/Index.tsx`

## Resultado

Al abrir la web ves el logo con dos botones: **Crear cuenta** (lleva al manual + formulario completo de aplicación) e **Iniciar sesión** (lleva a un login simple email + contraseña que entra directo a la galería).
