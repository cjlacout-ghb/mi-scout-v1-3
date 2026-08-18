import React from 'react';
import { APP_VERSION } from '@/lib/version';
import { Section, SubTitle, P, Note, Table, ulStyle, olStyle, codeStyle } from './GuiaComponents';

export default function GuiaES() {
  return (
    <>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 8, fontSize: '0.9rem' }}>
        Herramienta de tracking de pitcheos y zona de strike para softbol.
      </p>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 32, fontSize: '0.9rem' }}>
        Esta guia te lleva -paso a paso-, desde como instalar la aplicacion en tu celular hasta como generar reportes avanzados de rendimiento. La interfaz esta disenada para que puedas registrar cada jugada de forma rapida y sencilla mientras observas el partido.
      </p>

      {/* INDICE */}
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 40,
      }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Contenido</p>
        {[
          ['1', 'Como instalar la aplicacion?'],
          ['2', 'Activacion de licencia'],
          ['3', 'Navegacion'],
          ['4', 'Line-Up: gestion del partido'],
          ['5', 'Tracking: registrar en vivo'],
          ['6', 'Heat Map: estadisticas y exportacion'],
          ['7', 'Reporte: generacion de informes'],
          ['8', 'Historial de partidos'],
          ['9', 'Codigo de colores'],
          ['10', 'Guardado automatico'],
        ].map(([num, label]) => (
          <a
            key={num}
            href={`#s${num}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 0',
              textDecoration: 'none',
              borderBottom: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            <span style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 700, minWidth: 18 }}>{num}.</span>
            <span style={{ fontSize: '0.88rem' }}>{label}</span>
          </a>
        ))}
      </div>

      {/* S1 */}
      <Section id="s1" num="1" title="Como instalar la aplicacion en tu celular?">
        <P>MiScout es una aplicacion web progresiva (PWA). No necesitas descargarla desde ninguna tienda; podes instalarla directamente desde tu navegador para usarla como cualquier otra app.</P>
        <SubTitle>iPhone / iPad (Safari)</SubTitle>
        <ol style={olStyle}>
          <li>Abri MiScout en Safari.</li>
          <li>Toca Compartir (tres puntos, esquina inferior derecha).</li>
          <li>Selecciona Anadir marcador. Podes cambiar el nombre.</li>
          <li>Toca Guardar (esquina superior derecha).</li>
          <li>Listo! El icono aparece en tu pantalla de inicio.</li>
        </ol>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>(*) puede variar segun la version del sistema operativo.</p>
        <SubTitle>Android (Chrome)</SubTitle>
        <ol style={olStyle}>
          <li>Abri MiScout en Google Chrome.</li>
          <li>Toca Guardar (tres puntos, esquina superior derecha).</li>
          <li>Selecciona Agregar a la pantalla de inicio. Podes cambiar el nombre.</li>
          <li>Confirma tocando Agregar o Instalar.</li>
          <li>Listo! El icono aparece junto a tus otras apps.</li>
        </ol>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>(*) puede variar segun la version del sistema operativo.</p>
      </Section>

      {/* S2 */}
      <Section id="s2" num="2" title="Activacion de Licencia">
        <P>La primera vez que abris MiScout, la app verifica tu licencia antes de darte acceso.</P>
        <ul style={ulStyle}>
          <li>Veras la pantalla de <strong>Activar licencia</strong>.</li>
          <li>Ingresa el codigo de activacion que te fue proporcionado (formato: <code style={codeStyle}>MISCOUT-v13-XXXX-XXXX</code>).</li>
          <li>Al confirmar, la licencia quedara <strong>vinculada a ese dispositivo</strong> de forma permanente, por 1 ano.</li>
          <li>La app verifica la licencia con el servidor; necesitas conexion a internet <strong>solo en este paso inicial</strong>.</li>
          <li>Una vez activada, seras redirigido a la pantalla principal.</li>
        </ul>
        <P>Luego de la activacion, MiScout revalida la licencia periodicamente cuando hay conexion disponible. Si el dispositivo pasa un tiempo prolongado sin conectarse a internet (ej. durante un torneo de varios dias sin wifi), la app se puede seguir usando con normalidad durante un periodo de gracia de 10 dias. Pasado ese plazo sin conexion, es necesario conectarse al menos una vez para seguir usando la app.</P>

        <SubTitle>Planes de Licencia</SubTitle>
        <P>MiScout ofrece dos tipos de licencia:</P>
        <ul style={ulStyle}>
          <li><strong>Profesional</strong>: 1 ano de duracion, con acceso a las actualizaciones (releases) publicadas durante ese periodo.</li>
          <li><strong>Lanzamiento</strong>: duracion mas corta, sin acceso a actualizaciones adicionales durante su vigencia.</li>
        </ul>
        <P>Ambas se activan de la misma forma, ingresando el codigo de activacion correspondiente.</P>

        <Note>Podes acceder a esta guia en cualquier momento tocando el <strong>icono de libro</strong> ubicado en la esquina superior derecha del encabezado.</Note>
      </Section>

      {/* S3 */}
      <Section id="s3" num="3" title="Navegacion">
        <SubTitle>Cambio de idioma (ES/EN)</SubTitle>
        <P>En el encabezado, junto al icono de libro, hay dos botones: <strong>ES</strong> y <strong>EN</strong>, para elegir el idioma de la interfaz. Ten en cuenta que:</P>
        <ul style={ulStyle}>
          <li>El cambio afecta a la interfaz, etiquetas y formato de fecha (DD/MM/AAAA en espanol, MM/DD/AAAA en ingles).</li>
          <li>Los datos ya cargados (nombres de equipos, jugadores, tipos de lanzamiento, etc.) no se traducen — se guardan tal cual se ingresaron.</li>
          <li>Se puede cambiar de idioma en cualquier momento, incluso durante un partido en curso.</li>
        </ul>

        <P>La app tiene <strong>5 secciones</strong> accesibles desde la barra de navegacion inferior:</P>
        <Table
          headers={['Seccion', 'Funcion']}
          rows={[
            ['Line-Up', 'Gestionar el partido y las alineaciones'],
            ['Tracking', 'Registrar lanzamientos en tiempo real'],
            ['Heat Map', 'Ver estadisticas y mapa de calor'],
            ['Reporte', 'Generar y descargar reportes'],
            ['Historial', 'Consultar partidos finalizados'],
          ]}
        />
        <P>En la parte superior de la app siempre veras el nombre del partido activo (ej. <code style={codeStyle}>AUS vs ARG</code>). Si tocas el logo <strong>MiScout</strong> en el encabezado mientras hay un partido activo, se te preguntara si queres volver al inicio (lo que cerrara el partido actual sin eliminarlo).</P>
      </Section>

      {/* S4 */}
      <Section id="s4" num="4" title="Seccion Line-Up: Inicio y Gestion de Partidos">
        <P>La seccion <strong>Line-Up</strong> es el punto de partida. Aqui configuras el partido y armas las alineaciones.</P>

        <SubTitle>Iniciar un Nuevo Partido</SubTitle>
        <P>Toca <strong>Comenzar</strong> en la pantalla principal. Se abrira un formulario con los siguientes campos:</P>
        <ul style={ulStyle}>
          <li><strong>Equipo Visitante</strong> <em>(obligatorio)</em>: Nombre o sigla del equipo visitante (ej. <code style={codeStyle}>AUS</code>).</li>
          <li><strong>Equipo Local</strong> <em>(obligatorio)</em>: Nombre o sigla del equipo local (ej. <code style={codeStyle}>ARG</code>).</li>
          <li><strong>Evento</strong> <em>(opcional)</em>: Descripcion del evento (ej. <code style={codeStyle}>Torneo X — Juego 1</code>).</li>
          <li><strong>Fecha</strong>: Se completa automaticamente con la fecha de hoy; podes cambiarla tocando el campo.</li>
          <li><strong>Vista de zona de strike</strong>: Elegis si vas a marcar los lanzamientos desde la perspectiva del <strong>Catcher</strong> o del <strong>Pitcher</strong>.</li>
        </ul>

        <SubTitle>Gestionar el Lineup</SubTitle>
        <P>Una vez creado el partido, veras dos pestanas: <strong>Visitante</strong> y <strong>Local</strong>. Tenes dos formas de cargar jugadores:</P>
        <ul style={ulStyle}>
          <li><strong>Agregar 1 jugador</strong>: Formulario para cargar un jugador a la vez. Al guardar, la app te lleva directamente al Tracking.</li>
          <li><strong>Line-up completo</strong>: Tabla para cargar los 9 (o mas) jugadores de una sola vez en orden al bate. Si necesitas mas filas, toca <em>"+ Agregar fila"</em>.</li>
        </ul>

        <SubTitle>Datos de cada jugador</SubTitle>
        <ul style={ulStyle}>
          <li><strong># Camiseta</strong> <em>(obligatorio)</em>: Hasta 3 digitos.</li>
          <li><strong>Apellido</strong> <em>(obligatorio)</em>.</li>
          <li><strong>Nombre</strong> <em>(opcional)</em>.</li>
          <li><strong>Lado de bateo</strong>: <strong>D</strong> (Derecho), <strong>Z</strong> (Zurdo) o <strong>S</strong> (Switch/Ambos lados).</li>
        </ul>

        <SubTitle>Modificar el Lineup (durante el partido)</SubTitle>
        <ul style={ulStyle}>
          <li><strong>Editar</strong>: Icono del lapiz junto al jugador.</li>
          <li><strong>Eliminar</strong>: Boton <strong>rojo</strong>. Para proteger tus datos, esta opcion desaparece una vez que el partido finaliza.</li>
        </ul>

        <SubTitle>Sustituciones</SubTitle>
        <P>Si ingresa un bateador emergente, toca el boton <strong>"Sustitucion del bateador actual"</strong>:</P>
        <ul style={ulStyle}>
          <li>El saliente quedara tachado con la nota "Reemplazado por #X APELLIDO (Inning Y)".</li>
          <li>Si el saliente era <strong>abridor</strong>, aparece el boton <strong>"Reingresar"</strong> para devolverlo al juego.</li>
        </ul>

        <SubTitle>Otras acciones</SubTitle>
        <ul style={ulStyle}>
          <li>Tocar un jugador en partido <strong>finalizado</strong> navega directo a su pantalla de Heat Map / Stats.</li>
          <li>Boton <strong>"Nuevo partido"</strong> (rojo) descarta el partido actual (pide confirmacion).</li>
        </ul>
      </Section>

      {/* S5 */}
      <Section id="s5" num="5" title="Seccion Tracking: Registrando el Partido en Vivo">
        <P>La seccion <strong>Tracking</strong> es el corazon de la app. Aqui registras cada lanzamiento en tiempo real.</P>

        <SubTitle>Encabezado del Bateador Actual</SubTitle>
        <ul style={ulStyle}>
          <li>El <strong>numero</strong> de camiseta (en el cuadro dorado), apellido, nombre e inicial del lado de bateo.</li>
          <li>El <strong>equipo</strong> al que pertenece.</li>
          <li>El <strong>inning actual</strong>, con arriba para alta o abajo para baja.</li>
          <li>Controles <strong>+</strong> y <strong>-</strong> para avanzar o retroceder la mitad del inning manualmente.</li>
          <li>Stats rapidas: <strong>AB, H, O, K, BB/HBP</strong> y resultado del <strong>ultimo turno</strong>.</li>
        </ul>

        <SubTitle>Modo "Este partido" vs. "Acumulado"</SubTitle>
        <ul style={ulStyle}>
          <li><strong>Este partido</strong>: Solo los lanzamientos del partido actual.</li>
          <li><strong>Acumulado</strong>: Todos los lanzamientos historicos del jugador. <em>(Solo disponible con el partido finalizado.)</em></li>
        </ul>

        <SubTitle>Como registrar un lanzamiento?</SubTitle>
        <ol style={olStyle}>
          <li><strong>Toca la Zona</strong> donde cruzo la pelota. 8 sectores: zonas <strong>1-4</strong> (internas) y <strong>5-8</strong> (perimetrales). Se registran las coordenadas exactas del punto tocado.</li>
          <li><strong>Elegi el Tipo de Lanzamiento</strong> (panel desde abajo): Drop, Riser, Curva, Cambio, Screw u Otro.</li>
          <li><strong>Elegi el Resultado del turno al bate:</strong></li>
        </ol>

        <Table
          headers={['Resultado', 'Pasos adicionales']}
          rows={[
            ['OUT', 'Tipo de out (Asistencia / Fly / Sac Bunt / Linea) → Defensor (1-9, 7/8, 8/9) → Calidad (Soft / Hard)'],
            ['KS', 'Ponche swinging (tirando) — finaliza de inmediato'],
            ['KL', 'Ponche looking (mirando) — finaliza de inmediato'],
            ['HIT', 'Tipo de hit (Single / Doble / Triple / HR / Infield Hit / Bunt Hit) → Ubicacion → Calidad (Soft / Hard)'],
            ['BB', 'Base por bolas — finaliza de inmediato'],
            ['HBP', 'Golpeado por el pitch — finaliza de inmediato'],
          ]}
        />
        <Note>En el panel podes tocar <strong>←</strong> para retroceder un paso, o <strong>✕</strong> para cancelar sin guardar.</Note>

        <SubTitle>Confirmar y Corregir</SubTitle>
        <ul style={ulStyle}>
          <li><strong>Confirmar</strong>: Avanza al siguiente bateador y guarda el turno.</li>
          <li><strong>Editar</strong>: Si te equivocaste en la ubicacion del lanzamiento, toca un nuevo punto en la zona antes de confirmar para corregirlo.</li>
        </ul>

        <SubTitle>Cambio de Mitad de Inning</SubTitle>
        <P>Cuando el equipo a la defensiva logra los 3 outs, toca el boton (derecha del carrusel de orden al bate) para cambiar el equipo que pasa a batear. La app mostrara un aviso de confirmacion del inning. Tambien podes ajustar el inning manualmente usando los botones <strong>+</strong> y <strong>-</strong>.</P>

        <SubTitle>Seleccionar un Bateador Diferente</SubTitle>
        <P>En el carrusel de "Orden al bate" (debajo de la zona) veras los numeros de camiseta de todos los jugadores activos. Podes hacer click en cualquier jugador si queres trackear un bateador por fuera del orden al bate establecido.</P>

        <SubTitle>Historial de Turnos del Bateador</SubTitle>
        <P>Debajo de la zona veras todos los turnos del jugador en este partido (orden inverso). Desde ahi podes:</P>
        <ul style={ulStyle}>
          <li><strong>Editar</strong> un turno: cambia zona y/o datos del lanzamiento.</li>
          <li><strong>Eliminar</strong> un turno (con confirmacion).</li>
        </ul>

        <SubTitle>Notas sobre el Jugador</SubTitle>
        <P>Campo de texto libre al final de la pantalla para observaciones (ej. "Le cuesta batear los tiros bajos"). Se guarda automaticamente.</P>

        <SubTitle>Finalizar el Partido</SubTitle>
        <P>Boton rojo <strong>"Finalizar partido"</strong> al pie de la pantalla. Una vez finalizado:</P>
        <ul style={ulStyle}>
          <li>El partido se archiva en el <strong>Historial</strong>.</li>
          <li>La zona de strike cambia a <strong>modo solo lectura</strong> (perspectiva fija desde el catcher).</li>
          <li>Se habilitan las opciones de <strong>Modo Acumulado</strong>, <strong>Reporte</strong> y acceso completo al Historial.</li>
        </ul>
      </Section>

      {/* S6 */}
      <Section id="s6" num="6" title="Heat Map: estadisticas y exportacion">
        <P>La seccion <strong>Heat Map</strong> te permite analizar el rendimiento de cualquier jugador.</P>

        <SubTitle>Selector de Jugador</SubTitle>
        <P>Menu desplegable con todos los jugadores de los equipos del partido seleccionado. Podes ordenar:</P>
        <ul style={ulStyle}>
          <li><strong>Orden al bate</strong>: en el orden del lineup del partido seleccionado.</li>
          <li><strong>AVG</strong>: por promedio de bateo, con el numero coloreado segun su valor.</li>
        </ul>

        <SubTitle>Modo "Este partido" vs. "Acumulado"</SubTitle>
        <P><em>Solo disponible con el partido finalizado.</em></P>
        <ul style={ulStyle}>
          <li><strong>Este partido</strong>: Solo los datos del partido actual.</li>
          <li><strong>Acumulado</strong>: Suma <strong>todos los partidos</strong> registrados para ese jugador.</li>
        </ul>

        <SubTitle>Metricas del Jugador</SubTitle>
        <Table
          headers={['Stat', 'Descripcion']}
          rows={[
            ['AB', 'Turnos al bate totales'],
            ['H', 'Hits'],
            ['A/F', 'Outs (Asistencia + Fly)'],
            ['KS/KL', 'Ponches (swinging + looking)'],
            ['BB/HBP', 'Bases por bolas y golpeados'],
            ['AVG', 'Promedio de bateo'],
          ]}
        />

        <SubTitle>Mapa de Calor</SubTitle>
        <P>La zona de strike se muestra <strong>siempre desde la perspectiva del Catcher</strong> (independientemente de como se haya hecho el tracking):</P>
        <ul style={ulStyle}>
          <li><span style={{ color: '#62BB46', fontWeight: 700 }}>Verde / Azul</span>: Zona fria — el bateador no conecta hits ahi.</li>
          <li><span style={{ color: '#FFC20E', fontWeight: 700 }}>Amarillo</span>: Zona neutra.</li>
          <li><span style={{ color: '#F58220', fontWeight: 700 }}>Naranja</span> / <span style={{ color: '#F15B40', fontWeight: 700 }}>Rojo</span>: Zona caliente — el bateador es peligroso.</li>
        </ul>
        <P>Una leyenda <strong>COLD → HOT</strong> debajo de la zona ayuda a interpretar la escala.</P>

        <SubTitle>Desglose por Zona</SubTitle>
        <P>Tabla con 8 filas: Pitcheos, AB, Hits, A/F, K y AVG coloreado. Las zonas internas (1-4) se separan visualmente de las perimetrales (5-8).</P>

        <SubTitle>Tabla por Tipo de Lanzamiento</SubTitle>
        <P>Rendimiento del bateador segun el tipo de lanzamiento recibido (Drop, Riser, Curva, Cambio, Screw, Otro): cuantos vio, cuantos terminaron en AB, K y AVG. Solo aparecen los tipos que se registraron.</P>

        <SubTitle>Heat Map en vivo (on-the-fly)</SubTitle>
        <P>No hace falta esperar a que el partido finalice para consultar el mapa de calor. Podes ir a la seccion <strong>Heat Map</strong> en cualquier momento durante el partido y ver el estado actualizado de las estadisticas del bateador seleccionado, con los datos que se hayan registrado hasta ese momento.</P>
        <Note>El modo <strong>Acumulado</strong> sigue estando disponible solo una vez que el partido esta finalizado. Durante el juego en curso, el Heat Map muestra unicamente los datos de <strong>este partido</strong>.</Note>

        <SubTitle>Exportar el Heat Map como imagen (PNG)</SubTitle>
        <P>Podes guardar el mapa de calor del bateador seleccionado como una imagen PNG directamente en tu dispositivo.</P>
        <ul style={ulStyle}>
          <li>Toca el boton <strong>"Exportar PNG"</strong> debajo del mapa de calor.</li>
          <li>La imagen captura la zona de strike con el coloreado actual, incluyendo los tooltips de estadisticas por zona.</li>
          <li>El archivo se descarga automaticamente con el nombre del jugador (ej. <code style={codeStyle}>heatmap_smith.png</code>).</li>
          <li>Util para compartir el analisis con entrenadores o jugadores sin necesidad de acceder a la app.</li>
        </ul>
      </Section>

      {/* S7 */}
      <Section id="s7" num="7" title="Seccion Reporte: Generacion de Informes">
        <Note>Los reportes solo estan disponibles cuando el partido esta <strong>finalizado</strong>.</Note>
        <P>Podes generar cuatro combinaciones de reportes:</P>
        <Table
          headers={['', 'Este partido', 'Acumulado']}
          rows={[
            ['Jugador individual', '✓', '✓'],
            ['Equipo completo', '✓', '✓'],
          ]}
        />
        <ul style={ulStyle}>
          <li><strong>Jugador / Este partido</strong>: analisis del jugador solo en este partido.</li>
          <li><strong>Jugador / Acumulado</strong>: suma todos sus partidos historicos.</li>
          <li><strong>Equipo / Este partido</strong>: resumen de todos los jugadores del equipo en este partido.</li>
          <li><strong>Equipo / Acumulado</strong>: resumen historico de todos los jugadores del equipo.</li>
        </ul>
        <P>Antes de descargar veras una <strong>vista previa del contenido</strong>. Toca <strong>"Descargar .md"</strong> para guardar el reporte como archivo Markdown. El nombre del archivo se genera automaticamente (ej. <code style={codeStyle}>scout_smith_m.md</code> o <code style={codeStyle}>scout_equipo_acumulado.md</code>).</P>
      </Section>

      {/* S8 */}
      <Section id="s8" num="8" title="Seccion Historial de Partidos">
        <P>La seccion <strong>Historial</strong> guarda todos los partidos que has dado por finalizados. Cada tarjeta muestra: fecha, equipos, evento e innings jugados.</P>
        <ul style={ulStyle}>
          <li><strong>Tocar la tarjeta</strong> carga el partido y va a su Heat Map.</li>
          <li><strong>Boton "Seleccionar jugador"</strong> (dorado) carga el partido y va al Line-Up para elegir jugador.</li>
          <li><strong>Eliminar</strong> borra el partido y <em>todos sus datos permanentemente</em> (pide confirmacion).</li>
        </ul>

        <SubTitle>Reanudar un partido (Continuar)</SubTitle>
        <P>Si un partido quedo sin finalizar, su tarjeta en el Historial muestra el boton <strong>Continuar</strong>. Al tocarlo, la app reabre ese partido exactamente donde se dejo, listo para seguir el tracking.</P>
        <Note>Solo puede haber un partido activo a la vez: si se reanuda un partido mientras hay otro en curso, el que estaba activo se finaliza automaticamente antes de reabrir el elegido.</Note>
      </Section>

      {/* S9 */}
      <Section id="s9" num="9" title="Codigo de Colores Universal">
        <P>La app usa siempre los mismos colores para que puedas leer los datos a simple vista:</P>
        <Table
          headers={['Color', 'Significado']}
          rows={[
            ['Rojo', 'HIT (exito ofensivo)'],
            ['Verde', 'OUT / KS / KL (exito defensivo)'],
            ['Azul', 'BB / HBP (base por bolas o golpeado)'],
          ]}
        />
        <P>En el <strong>mapa de calor</strong>, la escala va de <span style={{ color: '#62BB46', fontWeight: 700 }}>verde frio</span> a <span style={{ color: '#F15B40', fontWeight: 700 }}>rojo caliente</span>, pasando por amarillo y naranja.</P>
        <P>En las <strong>tablas de AVG</strong>, el color del numero va de verde (promedio bajo) a rojo (promedio alto).</P>
      </Section>

      {/* S10 */}
      <Section id="s10" num="10" title="Guardado Automatico">
        <P>MiScout guarda el progreso automaticamente en tu dispositivo <strong>sin necesidad de conexion a internet durante el partido</strong>. Si cerras la app por accidente o el telefono se queda sin bateria, al volver a abrir la app el partido continuara exactamente donde lo dejaste.</P>
      </Section>

      {/* Footer */}
      <div style={{
        marginTop: 48,
        paddingTop: 24,
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          © 2026 <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Mi</span><span style={{ color: '#F5A623', fontWeight: 700 }}>Scout</span> — Todos los derechos reservados.<br />
          MiScout es software propietario. Queda expresamente prohibida su copia,<br />
          redistribucion, modificacion o uso comercial sin autorizacion escrita del autor.<br /><br />
          <em>Disclaimer: MiScout es una herramienta de analisis y seguimiento estadistico. Su uso no garantiza resultados deportivos, victorias ni mejoras de rendimiento especificas.</em><br /><br />
          Meta info: Version {APP_VERSION} | Idioma: Español | Ultima actualizacion: Agosto 2026
        </p>
      </div>
    </>
  );
}
