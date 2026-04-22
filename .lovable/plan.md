
# Modal al pulsar "Acceder" con dos opciones de registro

## Qué construir

Convertir el enlace "Acceder" del header en un disparador que abre un diálogo centrado con dos opciones claras:

- **Unirme como dentista**
- **Unirme como técnico dental**

Sin lógica de autenticación todavía — solo la UI del modal y los dos botones. Cada opción, al pulsarse, cierra el modal (placeholder para flujos futuros).

## Diseño del modal

Estética coherente con el resto del sitio: fondo claro, tipografía Poppins, bordes suaves, sin ornamento.

```text
┌─────────────────────────────────┐
│                                 │
│         Únete a Dentaly         │
│   Elige cómo quieres participar │
│                                 │
│  ┌───────────────────────────┐  │
│  │   Unirme como dentista    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Unirme como técnico dental│  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

- Título fino, subtítulo en gris suave.
- Dos botones apilados, ancho completo, peso ligero, igual jerarquía visual (el dentista arriba por ser el público mayoritario).
- Cierre con la X estándar del componente `Dialog` y al pulsar fuera.

## Implementación

**`src/components/Header.tsx`**
- Importar `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogTrigger` desde `@/components/ui/dialog` y `Button` desde `@/components/ui/button`.
- Reemplazar el `<a href="#">Acceder</a>` por un `<DialogTrigger asChild>` envolviendo un `<button>` con el mismo estilo actual.
- Añadir `<DialogContent>` con título, descripción y dos `<Button variant="outline">` apilados (`flex flex-col gap-3`).
- Cada botón tiene `onClick` que por ahora solo cierra el diálogo (estado local `open` controlado).

## Archivo afectado

- `src/components/Header.tsx` — único cambio.

## Resultado

Al pulsar "Acceder" en la esquina superior derecha, aparece un modal limpio con las dos vías de registro. Listo para conectar más adelante a formularios o auth real.
