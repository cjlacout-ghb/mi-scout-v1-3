# Guía de Usuario - Mi Scout

Bienvenido a **Mi Scout**, la aplicación diseñada para realizar el tracking avanzado y scouting de partidos de béisbol/sóftbol. Esta guía te explicará detalladamente cada una de las funcionalidades de la aplicación para que puedas sacarle el máximo provecho.

## 1. Inicio y Gestión de Partidos (Home)
Al ingresar a la aplicación, te encontrarás con la pantalla principal donde puedes gestionar los partidos.

### Crear un Nuevo Partido
- Permite registrar los detalles iniciales: fecha, equipo local, equipo visitante y una descripción.
- Se debe definir el **Lineup (Alineación)** inicial para ambos equipos.
- Un jugador que inicia el partido se considera **Jugador Abridor**.

### Gestión del Lineup
- **Agregar jugadores**: Puedes agregar jugadores uno a uno o cargar el line-up completo de 9 jugadores de una sola vez.
- **Editar jugadores**: Cada jugador en el lineup tiene un botón de edición (ícono de lápiz) para modificar sus datos (nombre, número, lado de bateo).
- **Eliminar jugadores**: Si agregaste un jugador por error, puedes eliminarlo del lineup presionando el botón "✕" (rojo) junto al jugador. Se te pedirá confirmación antes de eliminarlo. Esta opción solo está disponible mientras el partido no esté finalizado.
- **Sustituciones**: Puedes sustituir al bateador actual por un nuevo jugador ingresante durante el transcurso del partido.
- **Reingreso de abridores**: Si un abridor fue sustituido, puede reingresar al lineup desde la nota de sustitución.

### Partidos en Curso y Finalizados
- La aplicación guarda el estado global del partido. Puedes reanudar un partido en curso o revisar partidos ya completados.
- Una vez finalizado el partido, las opciones de edición (editar, eliminar, sustituir) desaparecen y el lineup queda en modo de solo lectura.
- Al seleccionar un jugador en un partido finalizado, la app redirige directamente a la pantalla de **Estadísticas** para consultar su rendimiento.

## 2. Tracking del Partido
Esta es la pantalla principal durante el juego (`/tracking`), donde se registra cada lanzamiento e incidencia.

### Bateador en Turno (Al Bate)
- La aplicación gestiona automáticamente el avance en el orden al bate, los innings (mitad alta y baja) y las vueltas al lineup.
- El **Orden al bate** se muestra en la parte inferior con botones numerados para cada jugador activo.
- El botón de **Cambio inn** (a la derecha del orden al bate) permite cambiar de equipo al bate (cambio de mitad de inning).
- Los controles **+** y **−** junto al indicador de inning permiten avanzar o retroceder la mitad de inning manualmente.
- Puedes realizar sustituciones durante el partido ingresando un **Jugador Sustituto**.

### Registro del Lanzamiento (Pitch)
Por cada lanzamiento puedes registrar:
- **Zona de Strike**: Puedes registrar la ubicación del pitch en zonas internas (1-4) o perimetrales (5-8). *Nota: Durante el tracking, puedes elegir ver la zona de strike desde la perspectiva del Pitcher o del Catcher.*
- **Tipo de Pitch**: Drop, Riser, Curva, Cambio, Screw, u Otro.

### Resultados del Turno al Bate (At-Bat)
Una vez que el turno finaliza, debes seleccionar el resultado:
- **BB (Base por Bolas)** o **HBP (Hit By Pitch / Golpeado)**
- **KS (Strikeout Swinging)** o **KL (Strikeout Looking)**
- **OUT**: Si seleccionas Out, podrás especificar:
  - **Tipo de Out**: Asistencia, Sac Bunt, Fly, Línea.
  - **Defensor/Ubicación**: Qué número de defensor realizó la jugada (posiciones 1 al 9, o zonas mixtas 7/8, 8/9).
  - **Calidad de Contacto**: Soft (Débil) o Hard (Fuerte).
- **HIT**: Si el bateador conecta un hit, podrás registrar:
  - **Tipo de Hit**: Bunt, Single, Doble, Triple, Home Run, Infield Hit.
  - **Ubicación y Calidad de Contacto**.

### Código de Colores de Resultados
La aplicación utiliza un esquema de colores estandarizado para identificar rápidamente los resultados de los turnos en el historial, estadísticas y puntos de impacto en la zona de strike:
- **Rojo**: HIT
- **Verde**: OUT
- **Azul**: Ponches (KS, KL)
- **Gris**: Base por Bolas (BB) / Golpeado (HBP)

### Confirmación y Edición
- Después de registrar un resultado, la app entra en modo de **confirmación** donde puedes:
  - **Confirmar**: Aceptar el registro y avanzar al siguiente bateador.
  - **Editar**: Reubicar el lanzamiento en la zona de strike si cometiste un error de posición.

### Notas del Bateador
- Cada bateador tiene un campo de notas donde puedes escribir observaciones relevantes (tendencias, puntos débiles, etc.).

## 3. Historial de Partidos
En la sección de **Historial** (`/historial`), puedes ver una lista completa de todos los partidos finalizados registrados en la base de datos de tu dispositivo.
- Puedes revisar la información básica de cada juego (fecha, equipos, innings jugados, descripción).
- **Cargar un partido**: Al hacer clic en una tarjeta de partido, se carga y redirige a la pantalla de Estadísticas.
- **Seleccionar jugador**: El botón "Seleccionar jugador" carga el partido y abre el lineup para que elijas un jugador específico. Al seleccionar un jugador, la app te lleva a la pantalla de Estadísticas.
- **Eliminar un partido**: El botón "✕" permite eliminar un partido y todos sus datos asociados. Se muestra un diálogo de confirmación antes de proceder, ya que esta acción no se puede deshacer.

## 4. Estadísticas (Stats)
En la sección de **Stats** (`/stats`), tendrás acceso a un panel detallado con el rendimiento de los bateadores.

### Selector de Jugador
- Puedes navegar entre jugadores usando los botones numerados en la parte superior.
- Dos modos de ordenamiento: **Orden al bate** (orden del lineup) y **AVG** (ordenado por promedio de bateo, de mayor a menor).

### Modo Acumulado
- Puedes activar el **modo acumulado** para ver las estadísticas globales de un jugador a lo largo de todos los partidos registrados (no solo el partido actual).

### Métricas Disponibles
- Turnos al bate (AB), Hits (H), Promedio de Bateo (AVG).
- Desglose de Hits (Dobles, Triples, HR).
- Ponches (KS, KL) y Bases por Bolas (BB/HBP).
- **Rendimiento por Zona**: Efectividad del bateador según en qué cuadrante entró el lanzamiento, visualizado con un mapa de calor (heat map) que va desde verde (frío/bajo rendimiento) hasta rojo (caliente/alto rendimiento).
  *(Nota Importante de Diseño: Todas las estadísticas y zonas de strike en esta sección SIEMPRE se muestran desde la perspectiva del Catcher, sin importar la perspectiva elegida al momento del tracking).*
- **Tipo de pitch / K**: Información sobre el desempeño del bateador frente a curvas, drops, cambios, risers, etc., incluyendo la cantidad total de ponches (K) recibidos por tipo de lanzamiento.

## 5. Reportes
La pantalla de **Reportes** (`/reporte`) permite generar informes consolidados del rendimiento y análisis avanzado para tomar decisiones estratégicas.

### Tipos de Reporte
- **Individual**: Reporte detallado de un bateador en el partido actual.
- **Acumulado**: Reporte de un bateador con datos de todos los partidos registrados.
- **Equipo**: Reporte consolidado de todo un equipo en el partido actual.
- **Equipo Acumulado**: Reporte consolidado de un equipo con datos de todos los partidos.

### Formato del Reporte
- Los reportes muestran el resultado del bateo indicando la posición defensiva involucrada (por ejemplo: "Bunt al 1 (SOFT)", "Asistencia al 6", "Single al 7").
- Las zonas se utilizan exclusivamente para el tracking de lanzamientos.
- Al igual que en la sección de Estadísticas, toda visualización de la zona de strike dentro de los reportes se renderiza obligatoriamente desde la **perspectiva del Catcher**.
- Estos reportes facilitan el análisis de debilidades y fortalezas (hot/cold zones) de los rivales, o medir el desarrollo y rendimiento del equipo propio a través de un partido o acumulados globales.
