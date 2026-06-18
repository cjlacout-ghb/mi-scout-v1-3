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

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 32, fontSize: '0.9rem' }}>
          Herramienta de tracking de pitcheos y zona de strike para sóftbol. Esta guía cubre todas las funciones disponibles.
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
            ['1', 'Instalar la aplicación'],
            ['2', 'Activación de licencia'],
            ['3', 'Navegación'],
            ['4', 'Line-Up y gestión del partido'],
            ['5', 'Tracking: registrar en vivo'],
            ['6', 'Heat Map y estadísticas'],
            ['7', 'Reportes'],
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

        {/* ─────────────────────────────────────────── */}
        <Section id="s1" num="1" title="Instalar la aplicación">
          <P>MiScout es una PWA (Progressive Web App). No necesitás descargarla de ninguna tienda; instalala directamente desde el navegador.</P>
          <SubTitle>iPhone / iPad (Safari)</SubTitle>
          <ol style={olStyle}>
            <li>Abrí MiScout en Safari.</li>
            <li>Tocá el botón de <strong>Compartir</strong> (cuadrado con flecha hacia arriba).</li>
            <li>Seleccioná <strong>"Agregar a inicio"</strong>.</li>
            <li>Confirmá tocando <strong>Agregar</strong>.</li>
          </ol>
          <SubTitle>Android (Chrome)</SubTitle>
          <ol style={olStyle}>
            <li>Abrí MiScout en Chrome.</li>
            <li>Tocá el menú de tres puntos (esquina superior derecha).</li>
            <li>Seleccioná <strong>"Agregar a la pantalla principal"</strong> o "Instalar aplicación".</li>
            <li>Confirmá tocando <strong>Agregar</strong> o "Instalar".</li>
          </ol>
        </Section>

        {/* ─────────────────────────────────────────── */}
        <Section id="s2" num="2" title="Activación de licencia">
          <P>La primera vez que abrís MiScout, la app verifica tu licencia antes de darte acceso.</P>
          <ul style={ulStyle}>
            <li>Verás la pantalla de <strong>Activar licencia</strong>.</li>
            <li>Ingresá el código de activación (formato: <code style={codeStyle}>MISCOUT-v13-XXXX-XXXX</code>).</li>
            <li>La licencia queda <strong>vinculada a ese dispositivo</strong> de forma permanente.</li>
            <li>Necesitás conexión a internet <strong>solo en este paso inicial</strong>.</li>
          </ul>
          <Note>Podés abrir esta guía en cualquier momento tocando el <strong>ícono de libro</strong> en la esquina superior derecha del encabezado.</Note>
        </Section>

        {/* ─────────────────────────────────────────── */}
        <Section id="s3" num="3" title="Navegación">
          <P>La app tiene 5 secciones accesibles desde la barra inferior:</P>
          <Table
            headers={['Sección', 'Función']}
            rows={[
              ['Line-Up', 'Gestionar el partido y las alineaciones'],
              ['Tracking', 'Registrar lanzamientos en tiempo real'],
              ['Heat Map', 'Estadísticas y mapa de calor por jugador'],
              ['Reporte', 'Generar y descargar reportes en texto'],
              ['Historial', 'Consultar partidos finalizados'],
            ]}
          />
          <P>En el encabezado siempre verás el partido activo. Si tocás el logo <strong>MiScout</strong> mientras hay un partido en curso, se te preguntará si querés volver al inicio (cerrando el partido sin eliminarlo).</P>
        </Section>

        {/* ─────────────────────────────────────────── */}
        <Section id="s4" num="4" title="Line-Up: gestión del partido">
          <SubTitle>Iniciar un nuevo partido</SubTitle>
          <P>Tocá <strong>Comenzar</strong> en la pantalla principal. El formulario incluye:</P>
          <ul style={ulStyle}>
            <li><strong>Equipo Visitante</strong> y <strong>Equipo Local</strong> *(obligatorios)*</li>
            <li><strong>Evento</strong> — descripción opcional (ej. "Torneo X — Juego 1")</li>
            <li><strong>Fecha</strong> — se completa sola, podés cambiarla</li>
            <li><strong>Vista de zona de strike</strong> — elegís si marcás los pitches desde perspectiva <strong>Catcher</strong> o <strong>Pitcher</strong></li>
          </ul>

          <SubTitle>Cargar jugadores</SubTitle>
          <ul style={ulStyle}>
            <li><strong>Agregar 1 jugador:</strong> Un jugador a la vez. Al guardar, la app te lleva directamente al Tracking.</li>
            <li><strong>Line-up completo:</strong> Tabla para cargar hasta 9+ jugadores de una sola vez en orden al bate. Cada fila acepta: número, apellido, nombre y lado de bateo (D / Z / S). Podés agregar más filas con <em>"+ Agregar fila"</em>.</li>
          </ul>

          <SubTitle>Modificar el lineup (durante el partido)</SubTitle>
          <ul style={ulStyle}>
            <li><strong>Editar</strong> — ícono de lápiz junto al jugador.</li>
            <li><strong>Eliminar</strong> — botón ✕ rojo. Desaparece al finalizar el partido.</li>
          </ul>

          <SubTitle>Sustituciones</SubTitle>
          <P>Botón <strong>"Sustitución del bateador actual"</strong> (visible mientras hay un bateador activo):</P>
          <ul style={ulStyle}>
            <li>El saliente queda tachado con la nota "↳ Reemplazado por #X APELLIDO (Inning Y)".</li>
            <li>Si el saliente era <strong>abridor</strong>, aparece el botón <strong>"Reingresar"</strong> para devolverlo al juego.</li>
          </ul>

          <SubTitle>Otras acciones</SubTitle>
          <ul style={ulStyle}>
            <li>Tocar un jugador en partido <strong>finalizado</strong> → navega directo a sus Stats.</li>
            <li>Botón <strong>"Nuevo partido"</strong> (rojo) → descarta el partido actual (pide confirmación).</li>
          </ul>
        </Section>

        {/* ─────────────────────────────────────────── */}
        <Section id="s5" num="5" title="Tracking: registrar en vivo">
          <SubTitle>Encabezado del bateador</SubTitle>
          <ul style={ulStyle}>
            <li>Número de camiseta, apellido, nombre y lado de bateo.</li>
            <li>Inning actual con ▲ (alta) o ▼ (baja).</li>
            <li>Botones <strong>+</strong> y <strong>−</strong> para ajustar la mitad del inning manualmente.</li>
            <li>Stats rápidas: <strong>AB, H, O, K, BB/HBP</strong> y resultado del último turno.</li>
          </ul>

          <SubTitle>Modo "Este partido" vs. "Acumulado"</SubTitle>
          <P>Un selector sobre la zona cambia qué datos se visualizan en los marcadores:</P>
          <ul style={ulStyle}>
            <li><strong>Este partido</strong> — solo los lanzamientos del partido actual.</li>
            <li><strong>Acumulado</strong> — todos los lanzamientos históricos del jugador. <em>(Solo disponible con el partido finalizado.)</em></li>
          </ul>

          <SubTitle>Cómo registrar un lanzamiento</SubTitle>
          <ol style={olStyle}>
            <li><strong>Tocá la zona</strong> donde cruzó la pelota. Hay 8 sectores: zonas <strong>1–4</strong> (internas) y <strong>5–8</strong> (perimetrales/esquinas). Se registran las coordenadas exactas del punto.</li>
            <li><strong>Elegí el tipo de pitch:</strong> Drop, Riser, Curva, Cambio, Screw u Otro.</li>
            <li><strong>Elegí el resultado:</strong></li>
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
          <P>En el panel podés tocar <strong>←</strong> para retroceder un paso, o <strong>✕</strong> para cancelar sin guardar.</P>

          <SubTitle>Confirmar o editar</SubTitle>
          <ul style={ulStyle}>
            <li><strong>Confirmar</strong> — avanza al siguiente bateador.</li>
            <li><strong>Editar</strong> — tocá un nuevo punto en la zona para corregir la ubicación antes de confirmar.</li>
          </ul>

          <SubTitle>Cambio de equipo al bate</SubTitle>
          <P>Tocá el botón <strong>⇄</strong> (derecha del carrusel de orden al bate) cuando el equipo defensor logra los 3 outs. La app muestra un aviso de confirmación del inning.</P>

          <SubTitle>Seleccionar un bateador diferente</SubTitle>
          <P>Tocá el número de camiseta en el <strong>carrusel de orden al bate</strong> para cambiar el bateador actual sin avanzar el orden.</P>

          <SubTitle>Historial de turnos</SubTitle>
          <P>Debajo de la zona de strike verás todos los turnos del jugador en este partido. Desde ahí podés:</P>
          <ul style={ulStyle}>
            <li><strong>✎ Editar</strong> un turno — cambia zona y/o datos del pitch.</li>
            <li><strong>✕ Eliminar</strong> un turno (con confirmación).</li>
          </ul>

          <SubTitle>Notas del jugador</SubTitle>
          <P>Campo de texto libre al final de la pantalla para observaciones (ej. "Le cuesta batear las curvas bajas"). Se guarda automáticamente.</P>

          <SubTitle>Finalizar el partido</SubTitle>
          <P>Botón rojo <strong>"Finalizar partido"</strong> al pie de la pantalla. Una vez finalizado, el partido se archiva en el Historial y la zona pasa a modo solo lectura.</P>
        </Section>

        {/* ─────────────────────────────────────────── */}
        <Section id="s6" num="6" title="Heat Map: estadísticas">
          <SubTitle>Selector de jugador</SubTitle>
          <ul style={ulStyle}>
            <li>Menú desplegable con todos los jugadores de ambos equipos.</li>
            <li>Ordenar por <strong>Orden al bate</strong> o por <strong>AVG</strong> (con color por temperatura).</li>
          </ul>

          <SubTitle>Modo "Este partido" vs. "Acumulado"</SubTitle>
          <P><em>Solo disponible con el partido finalizado.</em> El modo Acumulado suma todos los partidos históricos del jugador.</P>

          <SubTitle>Métricas</SubTitle>
          <Table
            headers={['Stat', 'Descripción']}
            rows={[
              ['AB', 'Turnos al bate totales'],
              ['H', 'Hits'],
              ['A/F', 'Outs (asistencia + fly)'],
              ['KS/KL', 'Ponches (swinging + looking)'],
              ['BB/HBP', 'Bases por bolas y golpeados'],
              ['AVG', 'Promedio de bateo'],
            ]}
          />

          <SubTitle>Mapa de calor</SubTitle>
          <P>La zona de strike siempre se muestra desde la <strong>perspectiva del Catcher</strong> (independientemente de cómo se hizo el tracking). Cada sector se colorea según la peligrosidad del bateador:</P>
          <ul style={ulStyle}>
            <li><span style={{ color: '#62BB46', fontWeight: 700 }}>Verde</span> — zona fría, no conecta hits ahí.</li>
            <li><span style={{ color: '#FFC20E', fontWeight: 700 }}>Amarillo</span> / <span style={{ color: '#F58220', fontWeight: 700 }}>Naranja</span> / <span style={{ color: '#F15B40', fontWeight: 700 }}>Rojo</span> — zona caliente, bateador peligroso.</li>
          </ul>

          <SubTitle>Desglose por zona</SubTitle>
          <P>Tabla con 8 filas (una por zona): Pitches, AB, Hits, A/F, K y AVG coloreado. Las zonas internas (1–4) se separan visualmente de las perimetrales (5–8).</P>

          <SubTitle>Tabla por tipo de pitch</SubTitle>
          <P>Rendimiento del bateador según el tipo de lanzamiento que recibió: cuántos vio, cuántos terminaron en AB, ponches (K) y AVG. Solo aparecen los tipos de pitch que se registraron.</P>
        </Section>

        {/* ─────────────────────────────────────────── */}
        <Section id="s7" num="7" title="Reportes">
          <Note>Los reportes solo están disponibles cuando el partido está <strong>finalizado</strong>.</Note>
          <P>Podés generar cuatro combinaciones:</P>
          <Table
            headers={['', 'Este partido', 'Acumulado']}
            rows={[
              ['Jugador individual', '✓', '✓'],
              ['Equipo completo', '✓', '✓'],
            ]}
          />
          <ul style={ulStyle}>
            <li><strong>Jugador / Este partido:</strong> análisis de un jugador solo en este partido.</li>
            <li><strong>Jugador / Acumulado:</strong> suma todos sus partidos históricos.</li>
            <li><strong>Equipo / Este partido:</strong> resumen de todos los jugadores del equipo en este partido.</li>
            <li><strong>Equipo / Acumulado:</strong> resumen histórico de todos los jugadores del equipo.</li>
          </ul>
          <P>Antes de descargar verás una <strong>vista previa del contenido</strong>. Tocá <strong>"Descargar .md"</strong> para guardar el reporte como archivo Markdown legible en cualquier editor de texto.</P>
        </Section>

        {/* ─────────────────────────────────────────── */}
        <Section id="s8" num="8" title="Historial de partidos">
          <P>Guardado de todos los partidos finalizados. Cada tarjeta muestra fecha, equipos, evento e innings jugados.</P>
          <ul style={ulStyle}>
            <li><strong>Tocar la tarjeta</strong> → carga el partido y va al Heat Map.</li>
            <li><strong>Botón "Seleccionar jugador"</strong> (dorado) → carga el partido y va al Line-Up para elegir jugador.</li>
            <li><strong>✕ Eliminar</strong> → borra el partido y <em>todos sus datos permanentemente</em> (pide confirmación).</li>
          </ul>
        </Section>

        {/* ─────────────────────────────────────────── */}
        <Section id="s9" num="9" title="Código de colores">
          <Table
            headers={['Color', 'Significado']}
            rows={[
              ['🔴 Rojo', 'HIT (éxito ofensivo)'],
              ['🟢 Verde', 'OUT / KS / KL (éxito defensivo)'],
              ['🔵 Azul', 'BB / HBP (base por bolas o golpeado)'],
            ]}
          />
          <P>En el mapa de calor la escala va de <span style={{ color: '#62BB46', fontWeight: 700 }}>verde frío</span> a <span style={{ color: '#F15B40', fontWeight: 700 }}>rojo caliente</span>. En las tablas de AVG el número también se colorea según el valor.</P>
        </Section>

        {/* ─────────────────────────────────────────── */}
        <Section id="s10" num="10" title="Guardado automático">
          <P>MiScout guarda el progreso automáticamente en tu dispositivo, <strong>sin necesidad de conexión a internet durante el partido</strong>. Si cerrás la app o el teléfono se queda sin batería, al volver a abrirla el partido continuará exactamente donde lo dejaste.</P>
        </Section>

        {/* Footer */}
        <div style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            © 2026 Cristian J. Lacout — Todos los derechos reservados.<br />
            MiScout es software propietario. Queda expresamente prohibida su copia,<br />
            redistribución, modificación o uso comercial sin autorización escrita del autor.
          </p>
        </div>

      </div>
    </div>
  );
}

// ─── Componentes internos de layout ───────────────────────────────────────────

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
      <div style={{ paddingLeft: 0 }}>{children}</div>
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
