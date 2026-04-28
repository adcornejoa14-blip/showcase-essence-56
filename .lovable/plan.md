# Pantalla de bienvenida con logo y login simulado

## Qué construir

Una **pantalla inicial a pantalla completa** con el logo `noma-logo-final.png` (el mismo de la portada actual) centrado y un único botón **"Acceder"**. Al pulsarlo, desaparece con una transición suave y aparece la web actual (header + galería de técnicos). Cada visita empieza siempre por esta pantalla — no se recuerda la sesión.

## Diseño

```text
┌─────────────────────────────────────┐
│                                     │
│                                     │
│           [   LOGO NOMA   ]         │
│                                     │
│                                     │
│            ┌──────────┐             │
│            │ Acceder  │             │
│            └──────────┘             │
│                                     │
└─────────────────────────────────────┘
```

- Fondo: mismo `bg-background` que el resto.
- Logo: centrado vertical + horizontal, mismo tamaño que ahora (`max-w-[900px]`, ~70% del ancho en desktop).
- Botón: debajo del logo, estilo minimal acorde al header actual (font-light, tracking-wide, borde sutil), texto "Acceder".
- Aparece con un fade-in suave al cargar (igual que el logo del Hero hoy).
- Al pulsar "Acceder": fade-out de la pantalla → fade-in de la web (≈400ms).

## Comportamiento

1. Al entrar en `/`, se muestra **solo** la pantalla de bienvenida.
2. El usuario pulsa "Acceder" — sin validar nada (login simulado, puramente visual).
3. La pantalla desaparece y aparece la home actual (`Header` + `Hero` + `TalentShowcase`).
4. Si el usuario recarga o vuelve a entrar, **vuelve a ver la pantalla de bienvenida** (sin persistencia).
5. Las rutas internas (`/tecnico/:slug`) **no** muestran la pantalla de bienvenida — solo `/`.

## Detalles técnicos

- **Nuevo componente:** `src/components/WelcomeScreen.tsx`
  - Recibe prop `onEnter: () => void`.
  - Renderiza un contenedor `fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center gap-12`.
  - Importa el logo desde `@/assets/noma-logo-final.png` (mismo import que `Hero.tsx`).
  - Botón con el mismo estilo minimal del header (`text-foreground/70 hover:text-foreground`, borde fino).
  - Estado interno `exiting` para hacer fade-out antes de llamar a `onEnter`.

- **Editado:** `src/pages/Index.tsx`
  - Estado `entered` (boolean, inicial `false`).
  - Si `!entered`: renderiza `<WelcomeScreen onEnter={() => setEntered(true)} />`.
  - Si `entered`: renderiza el contenido actual (Header + Hero + TalentShowcase) con un fade-in.
  - **Sin** `localStorage`/`sessionStorage` — cada visita arranca en la pantalla de bienvenida.

- **Sin cambios** en `Header.tsx`, `Hero.tsx`, rutas, o `TechnicianProfile`.

## Archivos afectados

- **Nuevo:** `src/components/WelcomeScreen.tsx`
- **Editado:** `src/pages/Index.tsx`

## Resultado

Al abrir la web, primero ves el logo de NOMA centrado con un botón "Acceder". Pulsándolo entras a la galería de técnicos como hasta ahora. Cada nueva visita o recarga vuelve a empezar por la pantalla del logo.
