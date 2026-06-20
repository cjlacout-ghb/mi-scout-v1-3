# Guía de Usuario - MiScout v1.3

¡Bienvenido a **MiScout**! Esta es una herramienta diseñada para ayudarte a registrar, analizar y visualizar el rendimiento de jugadores de softbol durante los partidos.

Esta guía te lleva paso a paso, desde cómo instalar la aplicación en tu celular hasta cómo generar reportes avanzados de rendimiento. No necesitas ser un experto en tecnología para usarla; la interfaz está diseñada para que puedas registrar cada jugada de forma rápida y sencilla mientras observás el partido.

---

## 1. Cómo instalar la aplicación en tu celular

MiScout es una aplicación web progresiva (PWA). No necesitás descargarla desde ninguna tienda; podés instalarla directamente desde tu navegador para usarla como cualquier otra app.

**En iPhone/iPad (Safari):**
1. Abre MiScout en Safari.
2. Toca el botón de **Compartir** (cuadrado con flecha apuntando hacia arriba, en la parte inferior).
3. Desplázate hacia abajo y selecciona **"Agregar a inicio"**.
4. Toca **Agregar** en la esquina superior derecha.
5. ¡Listo! Verás el ícono de MiScout en tu pantalla de inicio.

**En Android (Chrome):**
1. Abre MiScout en Google Chrome.
2. Toca el ícono de **Menú** (tres puntos verticales, esquina superior derecha).
3. Selecciona **"Agregar a la pantalla principal"** o "Instalar aplicación".
4. Confirma tocando **Agregar** o "Instalar".
5. ¡Listo! La app aparecerá junto a tus otras aplicaciones.

---

## 2. Activación de Licencia

La primera vez que abrís MiScout, la app verifica tu licencia antes de darte acceso.

- Verás la pantalla de **Activar licencia**.
- Ingresá el código de activación que te fue proporcionado (formato: `MISCOUT-v13-XXXX-XXXX`).
- Al confirmar, la licencia quedará **vinculada a ese dispositivo** de forma permanente.
- La app verifica la licencia con el servidor; necesitás conexión a internet **solo en este paso inicial**.
- Una vez activada, serás redirigido a la pantalla principal.

> **Nota:** Podés acceder a la guía de usuario en cualquier momento tocando el **ícono de libro** ubicado en la esquina superior derecha del encabezado.

---

## 3. Navegación

La app tiene **5 secciones** accesibles desde la barra de navegación inferior:

| Sección | Función |
|---|---|
| **Line-Up** | Gestionar el partido y las alineaciones |
| **Tracking** | Registrar lanzamientos en tiempo real |
| **Heat Map** | Ver estadísticas y mapa de calor |
| **Reporte** | Generar y descargar reportes |
| **Historial** | Consultar partidos finalizados |

En la parte superior de la app siempre verás el nombre del partido activo (ej. `AUS vs ARG`). Si tocás el logo **MiScout** en el encabezado mientras hay un partido activo, se te preguntará si querés volver al inicio (lo que cerrará el partido actual sin eliminarlo).

---

## 4. Line-Up: Inicio y Gestión de Partidos

La sección **Line-Up** es el punto de partida. Aquí configurás el partido y armás las alineaciones.

### Iniciar un Nuevo Partido

Tocá **Comenzar** en la pantalla principal. Se abrirá un formulario con los siguientes campos:

- **Equipo Visitante** *(obligatorio)*: Nombre o sigla del equipo visitante (ej. `AUS`).
- **Equipo Local** *(obligatorio)*: Nombre o sigla del equipo local (ej. `ARG`).
- **Evento** *(opcional)*: Descripción del evento (ej. `Torneo X — Juego 1`).
- **Fecha**: Se completa automáticamente con la fecha de hoy; podés cambiarla tocando el campo.
- **Vista de zona de strike**: Elegís si vas a marcar los lanzamientos desde la perspectiva del **Catcher** o del **Pitcher**. Esta decisión afecta cómo se muestra la zona durante el tracking.

### Gestionar el Lineup

Una vez creado el partido, verás dos pestañas: **Visitante** y **Local**. Tocá una para ver y editar esa alineación. Tenés dos formas de cargar jugadores:

- **Agregar 1 jugador**: Abre un formulario para cargar un jugador a la vez. Útil cuando agregás jugadores a medida que pasan al bate. Al guardar, la app te lleva directamente al Tracking.
- **Line-up completo**: Muestra una tabla para cargar los 9 (o más) jugadores de una sola vez, en orden al bate. Podés ingresar: número de camiseta, apellido, nombre y lado de bateo (D / Z / S). Si necesitás más filas, tocá **"+ Agregar fila"**.

### Datos de cada jugador

Para cada bateador se registra:
- **# Camiseta**: Número de la camiseta (hasta 3 dígitos).
- **Apellido** *(obligatorio)*.
- **Nombre** *(opcional)*.
- **Lado de bateo**: **D** (Derecho), **Z** (Zurdo) o **S** (Switch/Ambos lados).

### Modificar el Lineup

Mientras el partido esté en curso:
- **Editar**: Toca el ícono del lápiz junto a un jugador para corregir sus datos.
- **Eliminar**: Toca la **✕ roja** para borrar un jugador de la lista. *Esta opción desaparece una vez que el partido finaliza, para proteger tus datos.*

### Sustituciones

Si entra un bateador emergente durante el partido, tocá el botón **"Sustitución del bateador actual"** (visible en la sección Line-Up mientras hay un bateador activo). Se te pedirán los datos del jugador entrante, y el saliente quedará marcado como sustituido, con el inning indicado.

- El jugador saliente quedará tachado en el lineup con la nota "↳ Reemplazado por #X APELLIDO (Inning Y)".
- Si el jugador original era **abridor** (estaba en el lineup desde el inicio), aparecerá el botón **"Reingresar"** junto a su nombre, permitiéndote devolverlo al juego.

### Ver un jugador en Stats

Si el partido ya está finalizado, al tocar cualquier jugador del lineup serás redirigido automáticamente a su pantalla de **Heat Map / Stats**.

### Iniciar un partido nuevo

Tocá **"Nuevo partido"** (botón rojo) para descartar el partido actual y comenzar uno desde cero. Se te pedirá confirmación.

---

## 5. Tracking: Registrando el Partido en Vivo

La sección **Tracking** es el corazón de la app. Aquí registrás cada lanzamiento en tiempo real.

### Encabezado del Bateador Actual

En la parte superior verás:
- El **número** de camiseta del bateador actual (en el cuadro dorado).
- Su **apellido, nombre** e inicial del lado de bateo.
- El **equipo** al que pertenece.
- El **inning actual**, con ▲ para alta o ▼ para baja.
- Controles **+** y **−** para avanzar o retroceder la mitad del inning manualmente.

Si el bateador ya tiene turnos al bate, debajo del encabezado verás sus stats rápidas del partido: **AB** (turnos), **H** (hits), **O** (outs), **K** (ponches) y **BB/HBP**, además del resultado de su **último turno**.

### Modo "Este partido" vs. "Acumulado"

Un selector en la parte superior de la zona te permite cambiar qué datos se muestran en la zona de strike:
- **Este partido**: Solo los lanzamientos registrados en el partido actual.
- **Acumulado**: Todos los lanzamientos del jugador en todos los partidos registrados. *(Solo disponible cuando el partido está finalizado).*

### ¿Cómo registrar un lanzamiento?

1. **Toca la Zona**: Toca sobre la zona de strike donde cruzó la pelota. La zona está dividida en 8 sectores: zonas **1 a 4** son las 4 internas, y zonas **5 a 8** son las perimetrales (esquinas). Podés tocar con precisión dentro de cada sector; se registran las coordenadas exactas del punto tocado.

2. **Elegí el Tipo de Pitch** (se abre un panel deslizante desde abajo):
   - Drop, Riser, Curva, Cambio, Screw u Otro.

3. **Elegí el Resultado del turno al bate**:
   - **OUT** → elegís el tipo de out (Asistencia, Fly, Sac Bunt, Línea) → el número del defensor (1 al 9, incluyendo 7/8 y 8/9) → la calidad del contacto (Soft / Hard).
   - **KS** (Ponche swinging - tirando).
   - **KL** (Ponche looking - mirando).
   - **HIT** → elegís el tipo de hit (Single, Doble, Triple, Home Run, Infield Hit, Bunt Hit) → la ubicación del bateo (número del sector de campo) → la calidad del contacto (Soft / Hard).
   - **BB** (Base por bolas).
   - **HBP** (Hit by Pitch - golpeado).

   > Podés retroceder en el flujo del panel tocando la **← flecha** en la esquina superior izquierda, o cancelar tocando la **✕** para salir sin guardar.

### Confirmar y Corregir

Después de completar el registro de un turno al bate, verás los botones **Editar** y **Confirmar** sobre la zona:
- **Confirmar**: Avanza al siguiente bateador y guarda el turno.
- **Editar**: Si te equivocaste en la ubicación del pitch, podés tocar un nuevo punto en la zona antes de confirmar para corregirlo.

### Cambio de Mitad de Inning

Cuando el equipo a la defensiva logra los 3 outs, tocá el botón **⇄** (ubicado a la derecha del carrusel de orden al bate) para cambiar el equipo que pasa a batear. La app mostrará un aviso de confirmación indicando la mitad del inning que está por jugarse.

También podés ajustar el inning manualmente usando los botones **+** y **−** junto al número de inning.

### Seleccionar un Bateador Diferente

En el carrusel de "Orden al bate" (debajo de la zona de strike) verás los números de camiseta de todos los jugadores activos. Tocá uno para cambiar el bateador actual sin necesidad de avanzar el orden.

### Historial de Turnos del Bateador

Debajo de la zona de strike verás todos los turnos al bate registrados para el jugador actual en este partido (en orden inverso, el más reciente primero). Desde aquí podés:
- **✎ Editar** un turno: Cambia la zona tocando un nuevo punto y/o los datos del pitch desde el panel.
- **✕ Eliminar** un turno (con confirmación).

### Notas sobre el Jugador

Al final de la pantalla hay un campo de texto libre para escribir observaciones del jugador actual (ej. "Le cuesta batear las curvas bajas"). Las notas se guardan automáticamente al dejar de escribir.

### Finalizar el Partido

Cuando terminó el partido, tocá **"Finalizar partido"** (botón rojo). Se te pedirá confirmación. Una vez finalizado:
- El partido se archiva en el **Historial**.
- La zona de strike cambia a **modo solo lectura** (perspectiva catcher fija).
- Se habilitan las opciones de **Modo Acumulado**, **Reporte** y acceso completo al Historial.

---

## 6. Heat Map: Estadísticas y Mapa de Calor

La sección **Heat Map** (llamada **Stats** en el código) te permite analizar el rendimiento de cualquier jugador.

### Selector de Jugador

En la parte superior verás un **menú desplegable** con todos los jugadores de ambos equipos. Podés ordenar la lista de dos formas:
- **Orden al bate**: Muestra los jugadores en el orden en que aparecen en el lineup.
- **AVG**: Ordena a los jugadores por promedio de bateo (mejor primero), con el promedio coloreado según su valor (verde = frío, rojo = caliente).

### Modo "Este partido" vs. "Acumulado"

*(Solo disponible cuando el partido está finalizado)*

- **Este partido**: Muestra únicamente los datos del partido en curso.
- **Acumulado**: Suma los datos de **todos los partidos** registrados para ese jugador en la app.

### Métricas del Jugador

Verás 6 tarjetas con las estadísticas clave:
- **AB**: Turnos al bate totales.
- **H**: Hits.
- **A/F**: Outs (Asistencia + Fly).
- **KS/KL**: Ponches (swinging + looking).
- **BB/HBP**: Bases por bolas y golpeados.
- **AVG**: Promedio de bateo.

### Mapa de Calor (Heat Map)

La zona de strike se muestra **siempre desde la perspectiva del Catcher** (independientemente de cómo se haya hecho el tracking), con cada sector coloreado según la peligrosidad del bateador en esa zona:
- **Verde / Azul**: Zona fría — el bateador no conecta hits ahí.
- **Amarillo / Naranja / Rojo**: Zona caliente — el bateador es peligroso.

Una leyenda **COLD → HOT** debajo de la zona ayuda a interpretar la escala de colores.

### Desglose por Zona

Una tabla muestra, para cada una de las 8 zonas:
- **Pitches**: Total de lanzamientos que pasaron por esa zona.
- **AB**: Turnos al bate en esa zona (con resultado definitivo).
- **Hits**: Cantidad de hits.
- **A/F**: Outs.
- **K**: Ponches.
- **AVG**: Promedio en esa zona (coloreado).

Las zonas internas (1-4) se separan visualmente de las perimetrales (5-8).

### Tabla por Tipo de Pitch

Una tabla adicional muestra el rendimiento del bateador **según el tipo de lanzamiento** (Drop, Riser, Curva, Cambio, Screw, Otro), incluyendo: cuántos vio, cuántos terminaron en AB, cuántos K logró el pitcher y el AVG contra ese pitch. Solo aparecen los tipos de pitch que realmente se registraron.

---

## 7. Reporte: Generación de Documentos

La sección **Reporte** permite crear un documento de texto con el análisis del partido.

> **Nota:** Los reportes solo están disponibles cuando el partido está **finalizado**.

### Tipos de Reporte

Podés generar cuatro tipos de reportes combinando dos dimensiones:

| | Este partido | Acumulado |
|---|---|---|
| **Jugador individual** | ✓ | ✓ |
| **Equipo completo** | ✓ | ✓ |

- **Jugador / Este partido**: Análisis del jugador seleccionado solo en este partido.
- **Jugador / Acumulado**: Suma todos los partidos históricos del jugador.
- **Equipo / Este partido**: Resumen de todos los jugadores del equipo en este partido.
- **Equipo / Acumulado**: Resumen histórico de todos los jugadores del equipo.

### Vista Previa y Descarga

Antes de descargar, verás una **vista previa del contenido** del reporte directamente en la pantalla.

Tocá **"Descargar .md"** para guardar el reporte en tu dispositivo como un archivo `.md` (Markdown), legible en cualquier editor de texto o app de notas.

El nombre del archivo se genera automáticamente (ej. `scout_garcia_m.md` o `scout_equipo_acumulado.md`).

---

## 8. Historial de Partidos

La sección **Historial** guarda todos los partidos que finalizaste.

Cada tarjeta muestra: fecha, equipos, descripción del evento y cantidad de innings jugados.

Desde el historial podés:
- **Tocar una tarjeta** para cargar el partido y ver sus estadísticas en la sección **Heat Map**.
- **Tocar "Seleccionar jugador"** (botón dorado pequeño en la tarjeta) para cargar el partido y ver su **Line-Up**, desde donde podés navegar a las stats de cualquier jugador.
- **✕ Eliminar** el partido (con confirmación, ya que esta acción **borra todos los datos permanentemente** y no se puede deshacer).

---

## 9. Código de Colores Universal

La app usa siempre los mismos colores para que puedas leer los datos de un vistazo:

| Color | Significado |
|---|---|
| **Rojo** | HIT (éxito ofensivo) |
| **Verde** | OUT / KS / KL (éxito defensivo) |
| **Azul** | BB / HBP (base por bolas o golpeado) |

En el **mapa de calor**, la escala va de verde frío a rojo caliente, pasando por amarillo y naranja.

En las **tablas de AVG**, el color del número va de verde (promedio bajo) a rojo (promedio alto).

---

## 10. Guardado Automático

MiScout guarda el progreso automáticamente en tu dispositivo (sin necesidad de conexión a internet durante el partido). Si cerrás la app por accidente o el teléfono se queda sin batería, al volver a abrir la app el partido continuará exactamente donde lo dejaste.

---

© 2026 Cristian J. Lacout — Todos los derechos reservados.

MiScout es software propietario. Queda expresamente prohibida su copia, redistribución, modificación o uso comercial sin autorización escrita del autor.
