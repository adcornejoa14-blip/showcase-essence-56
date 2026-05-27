## Hero "Curated marketplace" — scroll-driven

Crear un nuevo hero scroll-driven en la **WelcomeScreen** (la pantalla con el logo NOMA, antes del login), inspirado en el screenshot de "Built to be found": layout de dos columnas con headline grande y bold a la izquierda + tarjeta beige redondeada a la derecha. Al hacer scroll, el contenido cambia tipo PowerPoint/Keynote.

### Estructura

1. **Sección inicial** (viewport completo): logo NOMA centrado + botones Create account / Sign in (lo que ya existe). Indicador sutil "scroll" abajo.
2. **Sección hero scroll-driven** (pin de ~4 viewports de alto):
   - Columna izquierda: headline gigante negro (estilo serif/sans bold extra grande tipo el screenshot) + subtítulo gris debajo + párrafo de apoyo.
   - Columna derecha: card beige `rounded-3xl` con título medio + descripción.
   - Las dos columnas hacen **crossfade** al scrollear entre 4 slides.

### Slides (defaults, editables luego)

1. **Curated marketplace** — "Hand-picked dental excellence" · Card: "Every clinic and lab vetted" — "We only invite the top 1% of dental professionals worldwide."
2. **Verified specialists** — "Credentials you can trust" · Card: "Real specialty, real cases" — "Implantology, orthodontics, prosthodontics — verified at the source."
3. **Cases delivered with precision** — "From scan to final restoration" · Card: "End-to-end digital workflow" — "Intraoral scans, design and milling in one orchestrated flow."
4. **Built for the modern clinic** — "Software that respects your time" · Card: "Less admin. More dentistry." — "NOMA handles referrals, payments and case tracking."

### Comportamiento (técnico)

- Componente nuevo `src/components/ScrollHero.tsx`.
- Wrapper con `height: 400vh` y un hijo `sticky top-0 h-screen`.
- Hook `useScroll` + `useTransform` de **framer-motion** (ya instalado) para mapear `scrollYProgress` → índice de slide (0–3) con `useMotionValueEvent`.
- Cada slide envuelto en `<motion.div>` con `opacity` interpolado por rangos (`[0, 0.2, 0.3, 0.5]` → `[0,1,1,0]`) para crossfade limpio.
- Tipografía: headline con `font-serif`-ish bold extra grande (`text-6xl md:text-8xl lg:text-9xl font-black tracking-tight`) usando los tokens existentes.
- Colores: usar tokens semánticos (`bg-background`, `text-foreground`, `bg-muted` para la card). Nada hardcoded.
- Indicador de progreso lateral (4 puntitos) que se ilumina con el slide activo.
- Mobile: stack vertical, misma mecánica de crossfade, tamaños reducidos.

### Integración

- Reescribir `WelcomeScreen.tsx` para ser scrollable (quitar `fixed inset-0`, dejar `min-h-screen` y permitir scroll).
- Orden: `[hero logo + CTAs full screen]` → `<ScrollHero />` → al final, repetir CTAs Create account / Sign in para no obligar a subir.
- No tocar la home post-login (ServiceSearch / WorldMap / TalentShowcase) ni ningún flujo de auth/onboarding.

### Archivos afectados

- **Nuevo:** `src/components/ScrollHero.tsx`
- **Editado:** `src/components/WelcomeScreen.tsx`
