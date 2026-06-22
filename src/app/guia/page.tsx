'use client';

import { useRouter } from 'next/navigation';

export default function GuiaPage() {
  const router = useRouter();

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header de la guía */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: '1.4rem',
            lineHeight: 1,
            padding: '0 4px',
            flexShrink: 0,
          }}
          aria-label="Volver"
        >
          ←
        </button>
        <div>
          <h1 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Guía de Usuario
          </h1>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>MiScout v1.3</p>
        </div>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: 680, margin: '0 auto' }}>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 8, fontSize: '0.9rem' }}>
          Herramienta de tracking de pitcheos y zona de strike para softbol.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 32, fontSize: '0.9rem' }}>
          Esta guía te lleva -paso a paso-, desde cómo instalar la aplicación en tu celular hasta cómo generar reportes avanzados de rendimiento. La interfaz está diseñada para que puedas registrar cada jugada de forma rápida y sencilla mientras observás el partido.
        </p>

        {/* ── ÍNDICE ── */}
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '16px 20px',
          marginBottom: 40,
        }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Contenido</p>
          {[
            ['1', '¿Cómo instalar la aplicación?'],
            ['2', 'Activación de licencia'],
            ['3', 'Navegación'],
            ['4', 'Line-Up: gestión del partido'],
            ['5', 'Tracking: registrar en vivo'],
            ['6', 'Heat Map: estadísticas'],
            ['7', 'Reporte: generación de informes'],
            ['8', 'Historial de partidos'],
            ['9', 'Código de colores'],
            ['10', 'Guardado automático'],
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

        {/* ── S1 ── */}
        <Section id="s1" num="1" title="¿Cómo instalar la aplicación en tu celular?">
          <P>MiScout es una aplicación web progresiva (PWA). No necesitás descargarla desde ninguna tienda; podés instalarla directamente desde tu navegador para usarla como cualquier otra app.</P>
          <SubTitle>iPhone / iPad (Safari)</SubTitle>
          <ol style={olStyle}>
            <li>Abrí MiScout en Safari.</li>
            <li>Tocá el botón de <strong>Compartir</strong> (cuadrado con flecha apuntando hacia arriba, en la parte inferior).</li>
            <li>Desplazate hacia abajo y seleccioná <strong>"Agregar a inicio"</strong>.</li>
            <li>Tocá <strong>Agregar</strong> en la esquina superior derecha.</li>
            <li>¡Listo! Verás el ícono de MiScout en tu pantalla de inicio.</li>
          </ol>
          <SubTitle>Android (Chrome)</SubTitle>
          <ol style={olStyle}>
            <li>Abrí MiScout en Google Chrome.</li>
            <li>Tocá el ícono de <strong>Menú</strong> (tres puntos verticales, esquina superior derecha).</li>
            <li>Seleccioná <strong>"Agregar a la pantalla principal"</strong> o "Instalar aplicación".</li>
            <li>Confirmá tocando <strong>Agregar</strong> o "Instalar".</li>
            <li>¡Listo! La app aparecerá junto a tus otras aplicaciones.</li>
          </ol>
        </Section>

        {/* ── S2 ── */}
        <Section id="s2" num="2" title="Activación de Licencia">
          <P>La primera vez que abrís MiScout, la app verifica tu licencia antes de darte acceso.</P>
          <ul style={ulStyle}>
            <li>Verás la pantalla de <strong>Activar licencia</strong>.</li>
            <li>Ingresá el código de activación que te fue proporcionado (formato: <code style={codeStyle}>MISCOUT-v13-XXXX-XXXX</code>).</li>
            <li>Al confirmar, la licencia quedará <strong>vinculada a ese dispositivo</strong> de forma permanente, por 1 año.</li>
            <li>La app verifica la licencia con el servidor; necesitás conexión a internet <strong>solo en este paso inicial</strong>.</li>
            <li>Una vez activada, serás redirigido a la pantalla principal.</li>
          </ul>
          <Note>Podés acceder a esta guía en cualquier momento tocando el <strong>ícono de libro</strong> ubicado en la esquina superior derecha del encabezado.</Note>
        </Section>

        {/* ── S3 ── */}
        <Section id="s3" num="3" title="Navegación">
          <P>La app tiene <strong>5 secciones</strong> accesibles desde la barra de navegación inferior:</P>
          <Table
            headers={['Sección', 'Función']}
            rows={[
              ['Line-Up', 'Gestionar el partido y las alineaciones'],
              ['Tracking', 'Registrar lanzamientos en tiempo real'],
              ['Heat Map', 'Ver estadísticas y mapa de calor'],
              ['Reporte', 'Generar y descargar reportes'],
              ['Historial', 'Consultar partidos finalizados'],
            ]}
          />
          <P>En la parte superior de la app siempre verás el nombre del partido activo (ej. <code style={codeStyle}>AUS vs ARG</code>). Si tocás el logo <strong>MiScout</strong> en el encabezado mientras hay un partido activo, se te preguntará si querés volver al inicio (lo que cerrará el partido actual sin eliminarlo).</P>
        </Section>

        {/* ── S4 ── */}
        <Section id="s4" num="4" title="Sección Line-Up: Inicio y Gestión de Partidos">
          <P>La sección <strong>Line-Up</strong> es el punto de partida. Aquí configurás el partido y armás las alineaciones.</P>

          <SubTitle>Iniciar un Nuevo Partido</SubTitle>
          <P>Tocá <strong>Comenzar</strong> en la pantalla principal. Se abrirá un formulario con los siguientes campos:</P>
          <ul style={ulStyle}>
            <li><strong>Equipo Visitante</strong> <em>(obligatorio)</em>: Nombre o sigla del equipo visitante (ej. <code style={codeStyle}>AUS</code>).</li>
            <li><strong>Equipo Local</strong> <em>(obligatorio)</em>: Nombre o sigla del equipo local (ej. <code style={codeStyle}>ARG</code>).</li>
            <li><strong>Evento</strong> <em>(opcional)</em>: Descripción del evento (ej. <code style={codeStyle}>Torneo X — Juego 1</code>).</li>
            <li><strong>Fecha</strong>: Se completa automáticamente con la fecha de hoy; podés cambiarla tocando el campo.</li>
            <li><strong>Vista de zona de strike</strong>: Elegís si vas a marcar los lanzamientos desde la perspectiva del <strong>Catcher</strong> o del <strong>Pitcher</strong>.</li>
          </ul>

          <SubTitle>Gestionar el Lineup</SubTitle>
          <P>Una vez creado el partido, verás dos pestañas: <strong>Visitante</strong> y <strong>Local</strong>. Tenés dos formas de cargar jugadores:</P>
          <ul style={ulStyle}>
            <li><strong>Agregar 1 jugador</strong>: Formulario para cargar un jugador a la vez. Al guardar, la app te lleva directamente al Tracking.</li>
            <li><strong>Line-up completo</strong>: Tabla para cargar los 9 (o más) jugadores de una sola vez en orden al bate. Si necesitás más filas, tocá <em>"+ Agregar fila"</em>.</li>
          </ul>

          <SubTitle>Datos de cada jugador</SubTitle>
          <ul style={ulStyle}>
            <li><strong># Camiseta</strong> <em>(obligatorio)</em>: Hasta 3 dígitos.</li>
            <li><strong>Apellido</strong> <em>(obligatorio)</em>.</li>
            <li><strong>Nombre</strong> <em>(opcional)</em>.</li>
            <li><strong>Lado de bateo</strong>: <strong>D</strong> (Derecho), <strong>Z</strong> (Zurdo) o <strong>S</strong> (Switch/Ambos lados).</li>
          </ul>

          <SubTitle>Modificar el Lineup (durante el partido)</SubTitle>
          <ul style={ulStyle}>
            <li><strong>Editar</strong>: Ícono del lápiz junto al jugador.</li>
            <li><strong>Eliminar</strong>: Botón <strong>✕ rojo</strong>. Para proteger tus datos, esta opción desaparece una vez que el partido finaliza.</li>
          </ul>

          <SubTitle>Sustituciones</SubTitle>
          <P>Si ingresa un bateador emergente, tocá el botón <strong>"Sustitución del bateador actual"</strong>:</P>
          <ul style={ulStyle}>
            <li>El saliente quedará tachado con la nota "↳ Reemplazado por #X APELLIDO (Inning Y)".</li>
            <li>Si el saliente era <strong>abridor</strong>, aparece el botón <strong>"Reingresar"</strong> para devolverlo al juego.</li>
          </ul>

          <SubTitle>Otras acciones</SubTitle>
          <ul style={ulStyle}>
            <li>Tocar un jugador en partido <strong>finalizado</strong> → navega directo a su pantalla de Heat Map / Stats.</li>
            <li>Botón <strong>"Nuevo partido"</strong> (rojo) → descarta el partido actual (pide confirmación).</li>
          </ul>
        </Section>

        {/* ── S5 ── */}
        <Section id="s5" num="5" title="Sección Tracking: Registrando el Partido en Vivo">
          <P>La sección <strong>Tracking</strong> es el corazón de la app. Aquí registrás cada lanzamiento en tiempo real.</P>

          <SubTitle>Encabezado del Bateador Actual</SubTitle>
          <ul style={ulStyle}>
            <li>El <strong>número</strong> de camiseta (en el cuadro dorado), apellido, nombre e inicial del lado de bateo.</li>
            <li>El <strong>equipo</strong> al que pertenece.</li>
            <li>El <strong>inning actual</strong>, con ▲ para alta o ▼ para baja.</li>
            <li>Controles <strong>+</strong> y <strong>−</strong> para avanzar o retroceder la mitad del inning manualmente.</li>
            <li>Stats rápidas: <strong>AB, H, O, K, BB/HBP</strong> y resultado del <strong>último turno</strong>.</li>
          </ul>

          <SubTitle>Modo "Este partido" vs. "Acumulado"</SubTitle>
          <ul style={ulStyle}>
            <li><strong>Este partido</strong>: Solo los lanzamientos del partido actual.</li>
            <li><strong>Acumulado</strong>: Todos los lanzamientos históricos del jugador. <em>(Solo disponible con el partido finalizado.)</em></li>
          </ul>

          <SubTitle>¿Cómo registrar un lanzamiento?</SubTitle>
          <ol style={olStyle}>
            <li><strong>Tocá la Zona</strong> donde cruzó la pelota. 8 sectores: zonas <strong>1–4</strong> (internas) y <strong>5–8</strong> (perimetrales). Se registran las coordenadas exactas del punto tocado.</li>
            <li><strong>Elegí el Tipo de Lanzamiento</strong> (panel desde abajo): Drop, Riser, Curva, Cambio, Screw u Otro.</li>
            <li><strong>Elegí el Resultado del turno al bate:</strong></li>
          </ol>

          <Table
            headers={['Resultado', 'Pasos adicionales']}
            rows={[
              ['OUT', 'Tipo de out (Asistencia / Fly / Sac Bunt / Línea) → Defensor (1–9, 7/8, 8/9) → Calidad (Soft / Hard)'],
              ['KS', 'Ponche swinging (tirando) — finaliza de inmediato'],
              ['KL', 'Ponche looking (mirando) — finaliza de inmediato'],
              ['HIT', 'Tipo de hit (Single / Doble / Triple / HR / Infield Hit / Bunt Hit) → Ubicación → Calidad (Soft / Hard)'],
              ['BB', 'Base por bolas — finaliza de inmediato'],
              ['HBP', 'Golpeado por el pitch — finaliza de inmediato'],
            ]}
          />
          <Note>En el panel podés tocar <strong>←</strong> para retroceder un paso, o <strong>✕</strong> para cancelar sin guardar.</Note>

          <SubTitle>Confirmar y Corregir</SubTitle>
          <ul style={ulStyle}>
            <li><strong>Confirmar</strong>: Avanza al siguiente bateador y guarda el turno.</li>
            <li><strong>Editar</strong>: Si te equivocaste en la ubicación del lanzamiento, tocá un nuevo punto en la zona antes de confirmar para corregirlo.</li>
          </ul>

          <SubTitle>Cambio de Mitad de Inning</SubTitle>
          <P>Cuando el equipo a la defensiva logra los 3 outs, tocá el botón <strong>⇄</strong> (derecha del carrusel de orden al bate) para cambiar el equipo que pasa a batear. La app mostrará un aviso de confirmación del inning. También podés ajustar el inning manualmente usando los botones <strong>+</strong> y <strong>−</strong>.</P>

          <SubTitle>Seleccionar un Bateador Diferente</SubTitle>
          <P>En el carrusel de "Orden al bate" (debajo de la zona) verás los números de camiseta de todos los jugadores activos. Podés hacer click en cualquier jugador si querés trackear un bateador por fuera del orden al bate establecido.</P>

          <SubTitle>Historial de Turnos del Bateador</SubTitle>
          <P>Debajo de la zona verás todos los turnos del jugador en este partido (orden inverso). Desde ahí podés:</P>
          <ul style={ulStyle}>
            <li><strong>✎ Editar</strong> un turno: cambia zona y/o datos del lanzamiento.</li>
            <li><strong>✕ Eliminar</strong> un turno (con confirmación).</li>
          </ul>

          <SubTitle>Notas sobre el Jugador</SubTitle>
          <P>Campo de texto libre al final de la pantalla para observaciones (ej. "Le cuesta batear los tiros bajos"). Se guarda automáticamente.</P>

          <SubTitle>Finalizar el Partido</SubTitle>
          <P>Botón rojo <strong>"Finalizar partido"</strong> al pie de la pantalla. Una vez finalizado:</P>
          <ul style={ulStyle}>
            <li>El partido se archiva en el <strong>Historial</strong>.</li>
            <li>La zona de strike cambia a <strong>modo solo lectura</strong> (perspectiva fija desde el catcher).</li>
            <li>Se habilitan las opciones de <strong>Modo Acumulado</strong>, <strong>Reporte</strong> y acceso completo al Historial.</li>
          </ul>
        </Section>

        {/* ── S6 ── */}
        <Section id="s6" num="6" title="Sección Heat Map: Estadísticas y Mapa de Calor">
          <P>La sección <strong>Heat Map</strong> te permite analizar el rendimiento de cualquier jugador.</P>

          <SubTitle>Selector de Jugador</SubTitle>
          <P>Menú desplegable con todos los jugadores de los equipos del partido seleccionado. Podés ordenar:</P>
          <ul style={ulStyle}>
            <li><strong>Orden al bate</strong>: en el orden del lineup del partido seleccionado.</li>
            <li><strong>AVG</strong>: por promedio de bateo, con el número coloreado según su valor.</li>
          </ul>

          <SubTitle>Modo "Este partido" vs. "Acumulado"</SubTitle>
          <P><em>Solo disponible con el partido finalizado.</em></P>
          <ul style={ulStyle}>
            <li><strong>Este partido</strong>: Solo los datos del partido actual.</li>
            <li><strong>Acumulado</strong>: Suma <strong>todos los partidos</strong> registrados para ese jugador.</li>
          </ul>

          <SubTitle>Métricas del Jugador</SubTitle>
          <Table
            headers={['Stat', 'Descripción']}
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
          <P>La zona de strike se muestra <strong>siempre desde la perspectiva del Catcher</strong> (independientemente de cómo se haya hecho el tracking):</P>
          <ul style={ulStyle}>
            <li><span style={{ color: '#62BB46', fontWeight: 700 }}>Verde / Azul</span>: Zona fría — el bateador no conecta hits ahí.</li>
            <li><span style={{ color: '#FFC20E', fontWeight: 700 }}>Amarillo</span>: Zona neutra.</li>
            <li><span style={{ color: '#F58220', fontWeight: 700 }}>Naranja</span> / <span style={{ color: '#F15B40', fontWeight: 700 }}>Rojo</span>: Zona caliente — el bateador es peligroso.</li>
          </ul>
          <P>Una leyenda <strong>COLD → HOT</strong> debajo de la zona ayuda a interpretar la escala.</P>

          <SubTitle>Desglose por Zona</SubTitle>
          <P>Tabla con 8 filas: Pitcheos, AB, Hits, A/F, K y AVG coloreado. Las zonas internas (1–4) se separan visualmente de las perimetrales (5–8).</P>

          <SubTitle>Tabla por Tipo de Lanzamiento</SubTitle>
          <P>Rendimiento del bateador según el tipo de lanzamiento recibido (Drop, Riser, Curva, Cambio, Screw, Otro): cuántos vio, cuántos terminaron en AB, K y AVG. Solo aparecen los tipos que se registraron.</P>
        </Section>

        {/* ── S7 ── */}
        <Section id="s7" num="7" title="Sección Reporte: Generación de Informes">
          <Note>Los reportes solo están disponibles cuando el partido está <strong>finalizado</strong>.</Note>
          <P>Podés generar cuatro combinaciones de reportes:</P>
          <Table
            headers={['', 'Este partido', 'Acumulado']}
            rows={[
              ['Jugador individual', '✓', '✓'],
              ['Equipo completo', '✓', '✓'],
            ]}
          />
          <ul style={ulStyle}>
            <li><strong>Jugador / Este partido</strong>: análisis del jugador solo en este partido.</li>
            <li><strong>Jugador / Acumulado</strong>: suma todos sus partidos históricos.</li>
            <li><strong>Equipo / Este partido</strong>: resumen de todos los jugadores del equipo en este partido.</li>
            <li><strong>Equipo / Acumulado</strong>: resumen histórico de todos los jugadores del equipo.</li>
          </ul>
          <P>Antes de descargar verás una <strong>vista previa del contenido</strong>. Tocá <strong>"Descargar .md"</strong> para guardar el reporte como archivo Markdown. El nombre del archivo se genera automáticamente (ej. <code style={codeStyle}>scout_smith_m.md</code> o <code style={codeStyle}>scout_equipo_acumulado.md</code>).</P>
        </Section>

        {/* ── S8 ── */}
        <Section id="s8" num="8" title="Sección Historial de Partidos">
          <P>La sección <strong>Historial</strong> guarda todos los partidos que has dado por finalizados. Cada tarjeta muestra: fecha, equipos, evento e innings jugados.</P>
          <ul style={ulStyle}>
            <li><strong>Tocar la tarjeta</strong> → carga el partido y va a su Heat Map.</li>
            <li><strong>Botón "Seleccionar jugador"</strong> (dorado) → carga el partido y va al Line-Up para elegir jugador.</li>
            <li><strong>✕ Eliminar</strong> → borra el partido y <em>todos sus datos permanentemente</em> (pide confirmación).</li>
          </ul>
        </Section>

        {/* ── S9 ── */}
        <Section id="s9" num="9" title="Código de Colores Universal">
          <P>La app usa siempre los mismos colores para que puedas leer los datos a simple vista:</P>
          <Table
            headers={['Color', 'Significado']}
            rows={[
              ['🔴 Rojo', 'HIT (éxito ofensivo)'],
              ['🟢 Verde', 'OUT / KS / KL (éxito defensivo)'],
              ['🔵 Azul', 'BB / HBP (base por bolas o golpeado)'],
            ]}
          />
          <P>En el <strong>mapa de calor</strong>, la escala va de <span style={{ color: '#62BB46', fontWeight: 700 }}>verde frío</span> a <span style={{ color: '#F15B40', fontWeight: 700 }}>rojo caliente</span>, pasando por amarillo y naranja.</P>
          <P>En las <strong>tablas de AVG</strong>, el color del número va de verde (promedio bajo) a rojo (promedio alto).</P>
        </Section>

        {/* ── S10 ── */}
        <Section id="s10" num="10" title="Guardado Automático">
          <P>MiScout guarda el progreso automáticamente en tu dispositivo <strong>sin necesidad de conexión a internet durante el partido</strong>. Si cerrás la app por accidente o el teléfono se queda sin batería, al volver a abrir la app el partido continuará exactamente donde lo dejaste.</P>
        </Section>

        {/* Footer */}
        <div style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            © 2026 Cristian J. Lacout — Todos los derechos reservados.<br />
            MiScout es software propietario. Queda expresamente prohibida su copia,<br />
            redistribución, modificación o uso comercial sin autorización escrita del autor.<br /><br />
            <em>Disclaimer: MiScout es una herramienta de análisis y seguimiento estadístico. Su uso no garantiza resultados deportivos, victorias ni mejoras de rendimiento específicas.</em><br /><br />
            Versión 1.3 | Idioma: Español | Última actualización: Julio 2026
          </p>
        </div>

      </div>
    </div>
  );
}

// ─── Componentes internos ─────────────────────────────────────────────────────

function Section({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 48, scrollMarginTop: 64 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
        <span style={{
          fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent)',
          background: 'var(--accent-dim)', borderRadius: 4,
          padding: '2px 7px', letterSpacing: '0.04em', flexShrink: 0,
        }}>{num}</span>
        <h2 style={{
          fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)',
          margin: 0, letterSpacing: '-0.01em',
        }}>{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)',
      textTransform: 'uppercase', letterSpacing: '0.07em',
      margin: '20px 0 8px',
    }}>{children}</h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.65, marginBottom: 10 }}>
      {children}
    </p>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(245,166,35,0.08)',
      border: '1px solid rgba(245,166,35,0.25)',
      borderLeft: '3px solid var(--accent)',
      borderRadius: 6,
      padding: '10px 14px',
      marginBottom: 14,
      fontSize: '0.82rem',
      color: 'var(--text-primary)',
      lineHeight: 1.55,
    }}>
      {children}
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 14 }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        fontSize: '0.82rem', color: 'var(--text-primary)',
        background: 'var(--bg-elevated)',
        borderRadius: 8, overflow: 'hidden',
      }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                padding: '9px 12px', textAlign: i === 0 ? 'left' : 'center',
                fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)',
                textTransform: 'uppercase', letterSpacing: '0.07em',
                background: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border)',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: ri < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  padding: '9px 12px',
                  textAlign: ci === 0 ? 'left' : 'center',
                  fontWeight: ci === 0 ? 600 : 400,
                  color: ci === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                  verticalAlign: 'top',
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const ulStyle: React.CSSProperties = {
  paddingLeft: 20,
  marginBottom: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
  fontSize: '0.88rem',
  color: 'var(--text-primary)',
  lineHeight: 1.6,
};

const olStyle: React.CSSProperties = {
  paddingLeft: 20,
  marginBottom: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  fontSize: '0.88rem',
  color: 'var(--text-primary)',
  lineHeight: 1.6,
};

const codeStyle: React.CSSProperties = {
  fontFamily: '"Courier New", Courier, monospace',
  fontSize: '0.82em',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  borderRadius: 4,
  padding: '1px 6px',
  color: 'var(--accent)',
};
