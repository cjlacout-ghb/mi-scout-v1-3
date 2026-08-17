'use client';

import { useState, useEffect } from 'react';
import { useScout } from '@/context/ScoutContext';
import { useLanguage } from '@/context/LanguageContext';
import { calcularEstadisticas, generarReporteMD } from '@/lib/storage';
import type { Bateador, TurnoAlBate } from '@/lib/types';
import { db } from '@/lib/dbClient';

function descargarMD(contenido: string, nombreArchivo: string) {
  const blob = new Blob([contenido], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

export default function ReportePage() {
  const { estado, dispatch, bateadorActual } = useScout();
  const { locale, t, tv } = useLanguage();
  const selId = estado.jugadorSeleccionadoId || bateadorActual?.id || '';
  const modoAcumuladoGlobal = estado.modoAcumuladoGlobal ?? false;
  const [preview, setPreview] = useState<string>('');
  const [modo, setModo] = useState<'individual' | 'equipo' | 'acumulado' | 'equipo_acumulado' | null>(null);
  const [selEquipo, setSelEquipo] = useState<'visitante' | 'local' | ''>('');
  const [cargando, setCargando] = useState(false);

  const todos = [...(estado.lineupVisitante || []), ...(estado.lineupLocal || [])];
  const partido = estado.partido;

  // Sincronizar reporte con modo global al cambiar jugador
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selId && partido) {
      const b = todos.find(x => x.id === selId);
      if (b) {
        if (modoAcumuladoGlobal) {
          generarAcumulado(b);
        } else {
          generarIndividual(b);
        }
      }
    }
  }, [selId, partido]);

  if (!partido) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">{t('report_page.no_match')}</div>
        <p className="empty-state__text">{t('report_page.no_match_text')}</p>
      </div>
    );
  }

  const generarIndividual = (b: Bateador) => {
    const stats = calcularEstadisticas(b.id, estado.turnosAlBate);
    const md = generarReporteMD(b, stats, estado.turnosAlBate, partido!, locale);
    setPreview(md);
    setModo('individual');
    dispatch({ type: 'SELECCIONAR_JUGADOR', payload: b.id });
    dispatch({ type: 'SET_MODO_ACUMULADO', payload: false });
  };

  const generarAcumulado = async (b: Bateador) => {
    setCargando(true);
    try {
      const batters = await db.bateadores
        .where('[apellido+numero+equipo]')
        .equals([b.apellido, b.numero, b.equipo])
        .toArray();
      const ids = batters.map(x => x.id);
      const turnosAcumulados = await db.turnos_al_bate.where('bateadorId').anyOf(ids).toArray();

      
      const turnosHomogeneos = turnosAcumulados.map(t => ({...t, bateadorId: b.id}));
      const stats = calcularEstadisticas(b.id, turnosHomogeneos);
      
      let md = `# ${t('report.title')} (${t('report_page.accumulated')}) — ${b.apellido}${b.nombre ? `, ${b.nombre}` : ''} (#${b.numero})\n\n`;
      md += `**${t('report.team')}:** ${b.equipo}\n\n`;
      md += `*${t('report_page.aggregated_data_note')}*\n\n`;
      md += `---\n\n`;

      const avg = stats.turnosAlBate > 0 ? stats.promedio.toFixed(3).replace('0.', '.') : '0.000';
      
      md += `## ${t('report.summary')} (${t('report_page.global')})\n\n`;
      md += `AB:${stats.turnosAlBate} H:${stats.hits} 2B:${stats.dobles} 3B:${stats.triples} HR:${stats.homeRuns} K:${stats.strikeoutsSwinging + stats.strikeoutsLooking} BB:${stats.basesPorBolas} AVG:${avg}\n\n`;


      const zonasCalientes = ([1,2,3,4,5,6,7,8] as const)
        .filter((z) => stats.porZona[z].hits > 0)
        .sort((a, b) => stats.porZona[b].hits - stats.porZona[a].hits);

      const zonasFrias = ([1,2,3,4,5,6,7,8] as const)
        .filter((z) => {
          const d = stats.porZona[z];
          const ab = d.hits + d.outs + d.ks + d.kl;
          return ab > 0 && d.hits === 0;
        })
        .sort((a, b) => stats.porZona[b].pitches - stats.porZona[a].pitches);


      if (zonasCalientes.length > 0) {
        md += `## ${t('report.hot_zones')}\n\n`;
        for (const z of zonasCalientes) {
          const d = stats.porZona[z];
          const pct = d.pitches > 0 ? Math.round((d.hits / d.pitches) * 100) : 0;
          md += `- **${t('report.zone')} ${z}**: ${d.hits} ${t('report.hits_in')} ${d.pitches} ${t('report.pitches')} — ${pct}% ${t('report.effectiveness')}\n`;
        }
        md += '\n';
      }

      if (zonasFrias.length > 0) {
        md += `## ${t('report.cold_zones')}\n\n`;
        for (const z of zonasFrias) {
          const d = stats.porZona[z];
          md += `- **${t('report.zone')} ${z}**: ${t('report.zero_hits')} ${d.pitches} ${t('report.pitches')}\n`;
        }
        md += '\n';
      }


      md += `---\n\n*${t('report.generated_by')}*\n`;
      setPreview(md);
      setModo('acumulado');
      dispatch({ type: 'SELECCIONAR_JUGADOR', payload: b.id });
      dispatch({ type: 'SET_MODO_ACUMULADO', payload: true });
    } catch (e) {
      console.error(e);
      alert(t('report_page.error_player'));
    }
    setCargando(false);
  };

  const generarEquipo = (equipo: string, lineup: Bateador[]) => {
    let md = `# ${t('report.title')} — ${t('report.team')} ${equipo}\n\n`;
    md += `**${t('report.match')}:** ${partido.descripcion}  \n`;
    md += `**${t('report.date')}:** ${new Date(partido.fecha + 'T12:00:00').toLocaleDateString(locale === 'en' ? 'en-US' : 'es-AR')}\n\n`;
    md += `---\n\n`;

    for (const b of lineup) {
      const stats = calcularEstadisticas(b.id, estado.turnosAlBate);
      if (stats.turnosAlBate === 0) continue;
      md += `## #${b.numero} ${b.apellido}${b.nombre ? `, ${b.nombre}` : ''}\n\n`;
      const avg = stats.turnosAlBate > 0 ? stats.promedio.toFixed(3).replace('0.', '.') : '.000';
      md += `AB:${stats.turnosAlBate} H:${stats.hits} 2B:${stats.dobles} 3B:${stats.triples} HR:${stats.homeRuns} K:${stats.strikeoutsSwinging + stats.strikeoutsLooking} BB:${stats.basesPorBolas} AVG:${avg}\n\n`;
      // Zonas calientes
      const calientes = ([1,2,3,4,5,6,7,8] as const)
        .filter((z) => stats.porZona[z].hits > 0)
        .map((z) => `${t('report.zone')} ${z} (${stats.porZona[z].hits} H)`)
        .join(', ');
      if (calientes) md += `**${t('report.hot_zones')}:** ${calientes}\n\n`;

      const frias = ([1,2,3,4,5,6,7,8] as const)
        .filter((z) => {
          const d = stats.porZona[z];
          return (d.hits + d.outs + d.ks + d.kl) > 0 && d.hits === 0;
        })
        .map((z) => `${t('report.zone')} ${z}`)
        .join(', ');
      if (frias) md += `**${t('report.cold_zones')}:** ${frias}\n\n`;
      md += `---\n\n`;
    }

    md += `*${t('report.generated_by')}*\n`;
    setPreview(md);
    setModo('equipo');
    dispatch({ type: 'SET_MODO_ACUMULADO', payload: false });
  };

  const generarEquipoAcumulado = async (equipo: string, lineup: Bateador[]) => {
    setCargando(true);
    try {
      let md = `# ${t('report.title')} (${t('report_page.accumulated')}) — ${t('report.team')} ${equipo}\n\n`;
      md += `*${t('report_page.aggregated_data_note')}*\n\n`;
      md += `---\n\n`;

      for (const b of lineup) {
        const batters = await db.bateadores
          .where('[apellido+numero+equipo]')
          .equals([b.apellido, b.numero, b.equipo])
          .toArray();
        const ids = batters.map(x => x.id);
        const turnosAcumulados = await db.turnos_al_bate.where('bateadorId').anyOf(ids).toArray();
        const turnosHomogeneos = turnosAcumulados.map(t => ({...t, bateadorId: b.id}));
        const stats = calcularEstadisticas(b.id, turnosHomogeneos);
        
        if (stats.turnosAlBate === 0) continue;
        md += `## #${b.numero} ${b.apellido}${b.nombre ? `, ${b.nombre}` : ''}\n\n`;
        const avg = stats.turnosAlBate > 0 ? stats.promedio.toFixed(3).replace('0.', '.') : '.000';
        md += `AB:${stats.turnosAlBate} H:${stats.hits} 2B:${stats.dobles} 3B:${stats.triples} HR:${stats.homeRuns} K:${stats.strikeoutsSwinging + stats.strikeoutsLooking} BB:${stats.basesPorBolas} AVG:${avg}\n\n`;
        
        const calientes = ([1,2,3,4,5,6,7,8] as const)
          .filter((z) => stats.porZona[z].hits > 0)
          .map((z) => `${t('report.zone')} ${z} (${stats.porZona[z].hits} H)`)
          .join(', ');
        if (calientes) md += `**${t('report.hot_zones')}:** ${calientes}\n\n`;
        
        const frias = ([1,2,3,4,5,6,7,8] as const)
          .filter((z) => {
            const d = stats.porZona[z];
            return (d.hits + d.outs + d.ks + d.kl) > 0 && d.hits === 0;
          })
          .map((z) => `${t('report.zone')} ${z}`)
          .join(', ');
        if (frias) md += `**${t('report.cold_zones')}:** ${frias}\n\n`;
        md += `---\n\n`;
      }

      md += `*${t('report.generated_by')}*\n`;
      setPreview(md);
      setModo('equipo_acumulado');
      dispatch({ type: 'SET_MODO_ACUMULADO', payload: true });
    } catch (e) {
      console.error(e);
      alert(t('report_page.error_team'));
    }
    setCargando(false);
  };

  const descargar = () => {
    if (!preview) return;

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const fecha = `${yyyy}-${mm}-${dd}`;
    const teamLabel = locale === 'es' ? 'EQUIPO' : 'TEAM';
    const cumLabel = locale === 'es' ? 'acumulado' : 'cumulative';

    if (modo === 'equipo') {
      const eq3 = (partido[selEquipo as 'visitante' | 'local'] || '').slice(0, 3).toUpperCase();
      const rivalName = selEquipo === 'visitante' ? partido.local : partido.visitante;
      const rival3 = (rivalName || '').slice(0, 3).toUpperCase();
      descargarMD(preview, `${fecha}_${teamLabel}-${eq3}_vs${rival3}.md`);
    } else if (modo === 'equipo_acumulado') {
      const eq3 = (partido[selEquipo as 'visitante' | 'local'] || '').slice(0, 3).toUpperCase();
      descargarMD(preview, `${fecha}_${teamLabel}-${eq3}_${cumLabel}.md`);
    } else if (modo === 'acumulado') {
      const b = todos.find((x) => x.id === selId);
      if (!b) return;
      const num = b.numero ?? '';
      const ap = (b.apellido ?? '').toUpperCase().replace(/ /g, '_');
      const nom = (b.nombre ?? '').toUpperCase().replace(/ /g, '_');
      const eq3 = (b.equipo ?? '').slice(0, 3).toUpperCase();
      descargarMD(preview, `${fecha}_${num}${ap}_${nom}-${eq3}_${cumLabel}.md`);
    } else {
      const b = todos.find((x) => x.id === selId);
      if (!b) return;
      const num = b.numero ?? '';
      const ap = (b.apellido ?? '').toUpperCase().replace(/ /g, '_');
      const nom = (b.nombre ?? '').toUpperCase().replace(/ /g, '_');
      const eq3 = (b.equipo ?? '').slice(0, 3).toUpperCase();
      const rivalName = b.rol === 'visitante' ? partido?.local : partido?.visitante;
      const rival3 = (rivalName ?? '').slice(0, 3).toUpperCase();
      descargarMD(preview, `${fecha}_${num}${ap}_${nom}-${eq3}_vs${rival3}.md`);
    }
  };

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <p className="text-xs text-secondary" style={{ marginBottom: 2 }}>{partido.descripcion}</p>
        <p style={{ fontWeight: 800, fontSize: '1rem' }}>{partido.visitante} vs {partido.local}</p>
      </div>

      {/* Botones principales */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p className="section-title" style={{ marginBottom: 4 }}>{t('report_page.generate')}</p>

        {/* Individual */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontWeight: 700, fontSize: '0.88rem' }}>{t('report_page.player')}</p>
          <select
            className="input"
            value={selId}
            onChange={(e) => dispatch({ type: 'SELECCIONAR_JUGADOR', payload: e.target.value })}
          >
            <option value="" disabled hidden>{t('report_page.select_player')}</option>
            {todos.map((b) => (
              <option key={b.id} value={b.id}>
                #{b.numero} {b.apellido}{b.nombre ? `, ${b.nombre}` : ''} - {b.equipo ? b.equipo.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()) : ''}
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: 8, background: 'var(--bg-elevated)', padding: 4, borderRadius: 8 }}>
            <button
              className={`btn btn-sm ${modo === 'individual' ? 'btn-primary' : ''}`}
              disabled={!selId || cargando || !partido.finalizado}
              onClick={() => {
                const b = todos.find((x) => x.id === selId);
                if (b) generarIndividual(b);
              }}
              style={{
                flex: 1,
                background: (!selId || cargando || !partido.finalizado) ? 'transparent' : (modo === 'individual' ? '' : 'transparent'),
                color: (!selId || cargando || !partido.finalizado) ? 'var(--text-secondary)' : (modo === 'individual' ? '' : 'var(--text-secondary)'),
                opacity: (!selId || cargando || !partido.finalizado) ? 0.5 : 1
              }}
            >
              {t('report_page.this_match')}
            </button>
            <button
              className={`btn btn-sm ${modo === 'acumulado' ? 'btn-primary' : ''}`}
              disabled={!selId || cargando || !partido.finalizado}
              onClick={() => {
                const b = todos.find((x) => x.id === selId);
                if (b) generarAcumulado(b);
              }}
              style={{
                flex: 1,
                background: (!selId || cargando || !partido.finalizado) ? 'transparent' : (modo === 'acumulado' ? '' : 'transparent'),
                color: (!selId || cargando || !partido.finalizado) ? 'var(--text-secondary)' : (modo === 'acumulado' ? '' : 'var(--text-secondary)'),
                opacity: (!selId || cargando || !partido.finalizado) ? 0.5 : 1
              }}
            >
              {cargando ? t('report_page.loading') : t('report_page.accumulated')}
            </button>
          </div>
        </div>

        {/* Equipo */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontWeight: 700, fontSize: '0.88rem' }}>{t('report_page.team')}</p>
          <select
            className="input"
            value={selEquipo}
            onChange={(e) => setSelEquipo(e.target.value as 'visitante' | 'local')}
          >
            <option value="" disabled hidden>{t('report_page.select_team')}</option>
            <option value="visitante">{partido.visitante} ({t('report_page.away')})</option>
            <option value="local">{partido.local} ({t('report_page.home')})</option>
          </select>
          <div style={{ display: 'flex', gap: 8, background: 'var(--bg-elevated)', padding: 4, borderRadius: 8 }}>
            <button
              className={`btn btn-sm ${modo === 'equipo' ? 'btn-primary' : ''}`}
              disabled={!selEquipo || cargando || !partido.finalizado}
              onClick={() => {
                if (selEquipo === 'visitante') generarEquipo(partido.visitante, estado.lineupVisitante);
                else if (selEquipo === 'local') generarEquipo(partido.local, estado.lineupLocal);
              }}
              style={{
                flex: 1,
                background: (!selEquipo || cargando || !partido.finalizado) ? 'transparent' : (modo === 'equipo' ? '' : 'transparent'),
                color: (!selEquipo || cargando || !partido.finalizado) ? 'var(--text-secondary)' : (modo === 'equipo' ? '' : 'var(--text-secondary)'),
                opacity: (!selEquipo || cargando || !partido.finalizado) ? 0.5 : 1
              }}
            >
              {t('report_page.this_match')}
            </button>
            <button
              className={`btn btn-sm ${modo === 'equipo_acumulado' ? 'btn-primary' : ''}`}
              disabled={!selEquipo || cargando || !partido.finalizado}
              onClick={() => {
                if (selEquipo === 'visitante') generarEquipoAcumulado(partido.visitante, estado.lineupVisitante);
                else if (selEquipo === 'local') generarEquipoAcumulado(partido.local, estado.lineupLocal);
              }}
              style={{
                flex: 1,
                background: (!selEquipo || cargando || !partido.finalizado) ? 'transparent' : (modo === 'equipo_acumulado' ? '' : 'transparent'),
                color: (!selEquipo || cargando || !partido.finalizado) ? 'var(--text-secondary)' : (modo === 'equipo_acumulado' ? '' : 'var(--text-secondary)'),
                opacity: (!selEquipo || cargando || !partido.finalizado) ? 0.5 : 1
              }}
            >
              {cargando ? t('report_page.loading') : t('report_page.accumulated')}
            </button>
          </div>
        </div>
      </div>

      {/* Vista previa */}
      {preview && (
        <div style={{ padding: '0 16px 16px' }}>
          <p className="section-title" style={{ marginBottom: 8 }}>{t('report_page.preview')}</p>
          <div
            className="card"
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '0.8rem',
              lineHeight: 1.6,
              maxHeight: 400,
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              color: 'var(--text-primary)',
              background: 'var(--bg-elevated)',
            }}
          >
            {preview}
          </div>

          <button
            className="btn btn-ghost btn-lg btn-full"
            style={{ marginTop: 12 }}
            onClick={descargar}
          >
            {t('report_page.download')}
          </button>
          <p className="text-xs text-secondary" style={{ textAlign: 'center', marginTop: 6 }}>
            {t('report_page.download_hint')}
          </p>
        </div>
      )}
    </div>
  );
}
