## Objetivo

Cambiar el login actual (que sólo acepta una cuenta hardcodeada) por autenticación real con email y contraseña, para que puedas crear tu cuenta y la de cualquier otro usuario.

## Pasos

1. **Activar Lovable Cloud**
   Provisión del backend (base de datos + autenticación). Sin cuentas externas, sin configuración manual.

2. **Configurar autenticación email + contraseña**
   - Auto-confirmación de email activada (entrada inmediata, sin email de verificación).
   - Sin tabla de perfiles extra: sólo email/contraseña.

3. **Crear cliente de auth y hook de sesión**
   - `src/integrations/...` se autogenera al activar Cloud.
   - Nuevo hook `useAuth()` que escucha `onAuthStateChange` y expone `user`, `session`, `loading`.

4. **Reescribir `LoginScreen`**
   - Quitar la lista hardcodeada `VALID_USERS`.
   - Llamar a `signInWithPassword({ email, password })`.
   - Mostrar errores reales del backend ("credenciales inválidas", etc.).

5. **Añadir registro real en el flujo de onboarding**
   - Al final de `OnboardingFlow` (paso 4 o un paso nuevo previo a "Submitted"), pedir email + contraseña y llamar a `signUp({ email, password, options: { emailRedirectTo: window.location.origin } })`.
   - Si el registro tiene éxito, marcar `phase = "app"` y entrar.

6. **Reemplazar el `phase` en `localStorage` por sesión real**
   - En `Index.tsx`, en lugar de leer `noma:phase`, decidir la pantalla según la sesión:
     - Sin sesión y sin acción → `welcome`.
     - Usuario pulsa "Iniciar sesión" → `login`.
     - Usuario pulsa "Crear cuenta" → `onboarding`.
     - Sesión activa → `app` (esto se mantiene tras refresh automáticamente porque la sesión vive en el almacenamiento del cliente del backend).
   - Añadir botón/acción de **cerrar sesión** en el `Header` cuando haya sesión.

## Detalles técnicos

- Auth client: `supabase.auth.signUp`, `signInWithPassword`, `signOut`, `getSession`, `onAuthStateChange`.
- Orden crítico en `useAuth`: registrar `onAuthStateChange` **antes** de `getSession()` para no perder eventos.
- No se crea tabla `profiles` (según tu elección). Si más adelante quieres guardar nombre, rol clínica/técnico, etc., se añade después.
- El flujo actual de onboarding (manual, rol, formulario) se conserva visualmente; sólo se le añade el paso de credenciales para registrar la cuenta real.

## Archivos afectados

- `src/pages/Index.tsx` — sustituir `phase` por estado basado en sesión.
- `src/components/onboarding/LoginScreen.tsx` — auth real.
- `src/components/onboarding/OnboardingFlow.tsx` — añadir paso de credenciales / llamada a `signUp`.
- `src/components/Header.tsx` — botón de cerrar sesión.
- Nuevo: `src/hooks/useAuth.tsx`.
- Autogenerados al activar Cloud: cliente del backend y tipos.
