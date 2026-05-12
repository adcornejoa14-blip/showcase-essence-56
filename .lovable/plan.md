## Objetivo
Cambiar todos los textos visibles de la interfaz del español al inglés, manteniendo la lógica y el diseño intactos.

## Alcance
Traducir copy en todos los componentes y páginas. No se tocan nombres de servicios (ya están en inglés), ni la lógica, ni los datos del backend.

## Archivos a actualizar

**Onboarding & Auth**
- `src/components/WelcomeScreen.tsx` — "Crear cuenta" → "Create account", "Iniciar sesión" → "Sign in"
- `src/components/onboarding/LoginScreen.tsx` — labels, placeholders, botones, mensajes de error
- `src/components/onboarding/OnboardingManual.tsx` — título, descripción, los 3 pasos, botones
- `src/components/onboarding/OnboardingRole.tsx` — "¿Cómo te unes?", roles, descripciones
- `src/components/onboarding/OnboardingForm.tsx` — todos los labels, placeholders, errores, botones, "Foto de perfil", "Fotos de tus trabajos", etc.
- `src/components/onboarding/OnboardingCredentials.tsx` — copy de creación de cuenta
- `src/components/onboarding/OnboardingSubmitted.tsx` — "Solicitud recibida", mensaje, "Continuar"

**App principal**
- `src/components/Header.tsx` — nav, "Cerrar sesión" → "Sign out"
- `src/components/Hero.tsx` — copy del hero
- `src/components/TalentShowcase.tsx` — títulos, filtros
- `src/components/ServiceSearch.tsx` — placeholder, labels
- `src/components/GalleryItem.tsx` — cualquier texto
- `src/components/WorldMap.tsx` — labels
- `src/components/case-upload/CaseUploadDialog.tsx` — todo el flujo de subida
- `src/components/case-upload/FileDropzone.tsx`
- `src/components/case-upload/ToothSelector.tsx`
- `src/pages/Index.tsx` — cualquier copy directo
- `src/pages/TechnicianProfile.tsx` — secciones del perfil
- `src/pages/NotFound.tsx` — ya está en inglés ✓
- `index.html` — `<title>`, meta description, lang="en"

**Datos**
- `src/data/technicians.ts` — revisar si hay bios/labels en español y traducir
- `src/lib/caseRequirements.ts` — revisar requisitos en texto

## Lo que NO se cambia
- Nombres propios (NOMA Digital Studio)
- Slugs, IDs, claves de datos
- Servicios en `src/data/services.ts` (ya en inglés)
- Lógica, validaciones, estructura de componentes
- Diseño, espaciado, tokens

## Verificación
Tras los cambios, recorrer las pantallas principales (welcome, login, onboarding completo, home, perfil técnico, diálogo de subir caso) en el preview para confirmar que no queda texto en español.
