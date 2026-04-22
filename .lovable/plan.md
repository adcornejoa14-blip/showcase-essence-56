
# Logo "NOMA DIGITAL STUDIO" como hero principal

## Qué cambia
El logo pasa de ser un pequeño elemento en el header a ser el protagonista absoluto de la primera pantalla, ocupando el ancho visual de la zona superior antes de la galería.

## Estructura nueva de la primera pantalla

**1. Header ultra-minimal (reducido)**
- Se mantiene sticky translúcido al hacer scroll.
- Se queda solo el ícono de menú hamburguesa (izquierda) y "Acceder" (derecha).
- Se elimina el "LOGO" placeholder del centro — el logo ya no vive en el header, vive en el hero debajo.

**2. Hero con logo a gran formato (nuevo)**
- Sección dedicada justo debajo del header, con fondo blanco y mucho aire (padding vertical generoso).
- Logo `NOMA DIGITAL STUDIO.` centrado, ocupando un ancho amplio:
  - Desktop: ~70% del ancho de pantalla (max ~900px)
  - Tablet: ~85%
  - Móvil: ~90% con margen lateral mínimo
- Imagen del logo importada desde `src/assets/` para que Vite la optimice.
- Sin texto adicional, sin tagline, sin botones — fiel al minimalismo aprobado.
- Fade-in suave al cargar la página.

**3. Galería Talent Showcase**
- Se mantiene exactamente igual debajo del hero del logo.
- Se elimina la etiqueta "TALENT SHOWCASE" pequeña (ahora redundante visualmente con un logo tan presente arriba), o se reduce aún más — lo decido por el equilibrio visual.

## Archivos afectados
- **Nuevo:** `src/assets/noma-logo.png` — copia del logo subido.
- **Nuevo:** `src/components/Hero.tsx` — sección hero con el logo grande.
- **Editado:** `src/components/Header.tsx` — quitar el placeholder "LOGO" del centro.
- **Editado:** `src/pages/Index.tsx` — insertar `<Hero />` entre `<Header />` y `<TalentShowcase />`.

## Pendiente de tu parte
Nada — con el PNG que ya subiste es suficiente para integrarlo. Si más adelante tienes una versión SVG, la sustituimos para máxima nitidez.
