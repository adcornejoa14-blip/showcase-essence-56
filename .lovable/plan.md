
# Hero minimalista + Galería Masonry de técnicos

## Concepto visual
Pantalla inicial casi en blanco, sin ruido. Todo el peso visual lo lleva el trabajo de los técnicos. Tipografía sans-serif fina, mucho aire, micro-interacciones suaves.

## Estructura de la primera pantalla

**1. Header centrado (minimal)**
- Fondo blanco puro (`#FFFFFF`) con opción de gris muy tenue (`#F9F9F9`) como alternativa.
- Logo centrado arriba (placeholder por ahora — lo sustituyes cuando me pases el archivo).
- A la izquierda, ícono de menú hamburguesa discreto (línea fina, sin caja).
- A la derecha, un acceso pequeño tipo texto ("Acceder") en gris claro, casi invisible.
- Sin border-bottom, sin sombras. Header sticky translúcido al hacer scroll.

**2. Galería "Talent Showcase" (Masonry tipo Pinterest)**
- Aparece inmediatamente debajo del logo, sin título grande ni CTAs (solo una etiqueta pequeña centrada: "Talent Showcase" en mayúsculas finas y espaciadas).
- Layout masonry responsive:
  - Desktop: 4 columnas
  - Tablet: 3 columnas
  - Móvil: 2 columnas
- Imágenes a sangre lateral en desktop (full-bleed, gutters mínimos de 4px) y con micro-margen en móvil para respirar. Esto evita decidir entre las dos opciones extremas y queda más pulido.
- Las imágenes mantienen su ratio original (clave en masonry para renders CAD verticales y fotos horizontales).
- Carga con fade-in escalonado al entrar en viewport.

**3. Hover sobre cada imagen**
- Overlay sutil con desenfoque (`backdrop-blur`) y oscurecimiento muy ligero.
- Aparece desde abajo:
  - **Nombre del técnico** (ej. "Ana López") — peso medio
  - **Especialidad** (ej. "Experta en Carillas") — gris claro
  - **Ciudad** (ej. "Madrid") — más pequeño aún
- Transición suave (~300ms ease-out). En móvil, la info aparece siempre visible en la esquina inferior con un degradado muy sutil (ya que no hay hover).

## Datos iniciales
- Estructura de datos lista en código (array de objetos con `image`, `name`, `specialty`, `city`) para que sustituyas fácilmente las imágenes que vas a subir.
- Mientras tanto, uso 8–10 placeholders neutros para visualizar el layout.

## Lo que NO incluye esta primera pantalla
- Sin hero con texto grande, sin botones CTA, sin subtítulos largos.
- Sin secciones extra debajo (eso se decidirá después).

## Pendiente de tu parte
- Logo (PNG/SVG) para sustituir el placeholder.
- Las imágenes reales de la galería cuando las tengas listas.
