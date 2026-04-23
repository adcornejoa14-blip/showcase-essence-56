
# Reemplazar el logo del Hero por el PDF de mayor calidad

## Qué hacer

Sustituir `src/assets/noma-logo.png` por el nuevo `noma-logo-final.pdf` subido, manteniendo exactamente el mismo tamaño y márgenes que se ven hoy en el Hero.

## Pasos

1. **Convertir el PDF a un formato web optimizado**
   - El navegador no puede mostrar un PDF dentro de un `<img>` con calidad fiable. Convertirlo a **SVG** (preferido, vectorial → nítido a cualquier escala) o, si la conversión a SVG no es limpia, a **PNG @2x** de alta resolución con fondo transparente.
   - Guardar el resultado en `src/assets/noma-logo-final.svg` (o `.png`).

2. **Actualizar el import en `src/components/Hero.tsx`**
   - Cambiar `import logo from "@/assets/noma-logo.png"` por el nuevo archivo.
   - **No tocar las clases de tamaño/espaciado** del `<img>` ni del contenedor: se mantienen `w-[90%] max-w-[900px] md:w-[85%] lg:w-[70%]` y los paddings `py-16 md:py-24 lg:py-28`. Así el logo ocupa exactamente el mismo espacio visual.

3. **Limpieza**
   - Eliminar el `noma-logo.png` antiguo de `src/assets/` para evitar archivos huérfanos en el bundle.

## Archivos afectados

- **Nuevo:** `src/assets/noma-logo-final.svg` (o `.png` @2x).
- **Editado:** `src/components/Hero.tsx` — solo cambia la ruta del import.
- **Eliminado:** `src/assets/noma-logo.png`.

## Resultado

Mismo logo, mismo tamaño y mismos márgenes en el Hero, pero renderizado desde un asset de mucha mayor calidad — nítido en pantallas Retina y a cualquier ancho.
