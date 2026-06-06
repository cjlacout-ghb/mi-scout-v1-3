# Guía de Usuario - Mi Scout

Bienvenido a **Mi Scout**, la aplicación diseñada para realizar el tracking avanzado y scouting de partidos de béisbol/sóftbol. Esta guía te explicará detalladamente cada una de las funcionalidades de la aplicación para que puedas sacarle el máximo provecho.

## 1. Inicio y Gestión de Partidos (Home)
Al ingresar a la aplicación, te encontrarás con la pantalla principal donde puedes gestionar los partidos.

### Crear un Nuevo Partido
- Permite registrar los detalles iniciales: fecha, equipo local, equipo visitante y una descripción.
- Se debe definir el **Lineup (Alineación)** inicial para ambos equipos.
- Un jugador que inicia el partido se considera **Jugador Abridor**.

### Partidos en Curso y Finalizados
- La aplicación guarda el estado global del partido. Puedes reanudar un partido en curso o revisar partidos ya completados.

## 2. Tracking del Partido
Esta es la pantalla principal durante el juego (`/tracking`), donde se registra cada lanzamiento e incidencia.

### Bateador en Turno (Al Bate)
- La aplicación gestiona automáticamente el avance en el orden al bate, los innings (mitad alta y baja) y las vueltas al lineup.
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

## 3. Historial de Partidos
En la sección de **Historial** (`/historial`), puedes ver una lista completa de todos los partidos registrados en la base de datos de tu dispositivo.
- Puedes revisar la información básica de cada juego (fecha, equipos, innings jugados).
- Los partidos se pueden filtrar o identificar según si están "Finalizados" o "En Curso".

## 4. Estadísticas (Stats)
En la sección de **Stats** (`/stats`), tendrás acceso a un panel detallado con el rendimiento de los bateadores.

### Métricas Disponibles
- Turnos al bate (AB), Hits (H), Promedio de Bateo (AVG).
- Desglose de Hits (Dobles, Triples, HR).
- Ponches (KS, KL) y Bases por Bolas (BB/HBP).
- **Rendimiento por Zona**: Efectividad del bateador según en qué cuadrante entró el lanzamiento. 
  *(Nota Importante de Diseño: Todas las estadísticas y zonas de strike en esta sección **SIEMPRE** se muestran desde la perspectiva del **Catcher**, sin importar la perspectiva elegida al momento del tracking).*
- **Rendimiento por Tipo de Pitch**: Información sobre el desempeño del bateador frente a curvas, drops, cambios, risers, etc.

## 5. Reportes
La pantalla de **Reportes** (`/reporte`) permite generar informes consolidados del rendimiento y análisis avanzado para tomar decisiones estratégicas.
- Al igual que en la sección de Estadísticas, toda visualización de la zona de strike dentro de los reportes se renderiza obligatoriamente desde la **perspectiva del Catcher**.
- Estos reportes facilitan el análisis de debilidades y fortalezas (hot/cold zones) de los rivales, o medir el desarrollo y rendimiento del equipo propio a través de un partido o acumulados globales.
