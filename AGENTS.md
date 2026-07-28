<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design System Rules
1. **Botones Proactivos (Proactive Buttons):** Any button that performs a primary, constructive, or forward-moving action (e.g., "Comenzar", "Completar line-up", "Guardar", "Generar", "Confirmar") MUST use the `btn-primary` class (golden background, black letters).
2. **Botones Destructivos (Destructive Buttons):** Any button that breaks, deletes, or resets something (e.g., "Nuevo partido", "Eliminar", "Cancelar") MUST use the `btn-danger` class (red/dark red appearance).
3. **No Icons:** Do not use emojis or icons inside button text. Keep buttons text-only to maintain a clean, simple, and serious look and feel.

# Perspectiva de Visualización
1. **Stats y Reportes:** Sin importar en qué perspectiva (pitcher o catcher) se haya hecho el tracking de los lanzamientos durante el partido, las secciones de Estadísticas (Stats) y Reporte SIEMPRE deben mostrar la información y la zona de strike desde la perspectiva del catcher (catcher's perspective).

# UI & Layout Rules
1. **Heat Map Tooltips:** Los tooltips de estadísticas por zona en los Heat Maps deben mantener una estructura fija dentro de cada componente `.zona-esquina` y `.zona-cuadrante` (renderizando `<div className="zone-tooltip">` por cada zona). No deben seguir el cursor, sino aparecer fijos con posición relativa a su zona anfitriona y delegar el control de los bordes perimetrales (para evitar cortes en las zonas 5, 6, 7 y 8) a través de las reglas CSS establecidas en `globals.css` (clases `.es5 .zone-tooltip`, etc.).
