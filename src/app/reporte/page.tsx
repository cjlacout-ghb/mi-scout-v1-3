'use client';

import { useState, useEffect } from 'react';
import { useScout } from '@/context/ScoutContext';
import { calcularEstadisticas, generarReporteMD } from '@/lib/storage';
import type { Bateador, TurnoAlBate } from '@/lib/types';

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
        // Evitamos regenerar si el modo actual ya coincide con el global
        if (modoAcumuladoGlobal && modo !== 'acumulado') {
          generarAcumulado(b);
        } else if (!modoAcumuladoGlobal && modo !== 'individual') {
          generarIndividual(b);
        }
      }
    }
  }, [selId, modoAcumuladoGlobal, partido]);

  if (!partido) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">Sin partido activo</div>
        <p className="empty-state__text">Inicia un partido y registra al menos un turno al bate para generar reportes. O selecciona desde el Historial.</p>
      </div>
    );
  }

  const generarIndividual = (b: Bateador) => {
    const stats = calcularEstadisticas(b.id, estado.turnosAlBate);
    const md = generarReporteMD(b, stats, estado.turnosAlBate, partido!);
    setPreview(md);
    setModo('individual');
    dispatch({ type: 'SELECCIONAR_JUGADOR', payload: b.id });
    dispatch({ type: 'SET_MODO_ACUMULADO', payload: false });
  };

  const generarAcumulado = async (b: Bateador) => {
    setCargando(true);
    try {
      const params = new URLSearchParams({
        apellido: b.apellido,
        numero: b.numero,
        equipo: b.equipo || ''
      });
      const res = await fetch(`/api/jugador/stats?${params.toString()}`);
      const data = await res.json();
      const turnosAcumulados: TurnoAlBate[] = data.turnos || [];

      
      const turnosHomogeneos = turnosAcumulados.map(t => ({...t, bateadorId: b.id}));
      const stats = calcularEstadisticas(b.id, turnosHomogeneos);
      
      let md = `# Reporte de Scouting Acumulado — ${b.apellido}${b.nombre ? `, ${b.nombre}` : ''} (#${b.numero})\n\n`;
      md += `**Equipo:** ${b.equipo}\n\n`;
      md += `*Datos agregados de todos los partidos registrados.*\n\n`;
      md += `---\n\n`;

      const avg = stats.turnosAlBate > 0 ? stats.promedio.toFixed(3).replace('0.', '.') : '0.000';
      
      md += `## Resumen Global\n\n`;
      const padC = (v: string | number, l: number) => {
        const s = String(v);
        const pL = Math.floor((l - s.length) / 2);
        return ' '.repeat(Math.max(0, pL)) + s + ' '.repeat(Math.max(0, l - s.length - pL));
      };

      md += `| AB | H | 2B | 3B | HR | K | BB/HBP | AVG  |\n`;
      md += `|----|---|----|----|----|---|--------|------|\n`;
      md += `| ${padC(stats.turnosAlBate, 2)} | ${padC(stats.hits, 1)} | ${padC(stats.dobles, 2)} | ${padC(stats.triples, 2)} | ${padC(stats.homeRuns, 2)} | ${padC(stats.strikeoutsSwinging + stats.strikeoutsLooking, 1)} | ${padC(stats.basesPorBolas, 6)} | ${padC(avg, 4)} |\n\n`;


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
        md += `## Zonas Calientes\n\n`;
        for (const z of zonasCalientes) {
          const d = stats.porZona[z];
          const pct = d.pitches > 0 ? Math.round((d.hits / d.pitches) * 100) : 0;
          md += `- **Zona ${z}**: ${d.hits} hit(s) en ${d.pitches} pitch(es) — ${pct}% efectividad\n`;
        }
        md += '\n';
      }

      if (zonasFrias.length > 0) {
        md += `## Zonas Frías\n\n`;
        for (const z of zonasFrias) {
          const d = stats.porZona[z];
          md += `- **Zona ${z}**: 0 hits en ${d.pitches} pitch(es)\n`;
        }
        md += '\n';
      }


      md += `---\n\n*Generado por MiScout v1.1*\n`;
      setPreview(md);
      setModo('acumulado');
      dispatch({ type: 'SELECCIONAR_JUGADOR', payload: b.id });
      dispatch({ type: 'SET_MODO_ACUMULADO', payload: true });
    } catch (e) {
      console.error(e);
      alert('Error cargando historial del jugador');
    }
    setCargando(false);
  };

  const generarEquipo = (equipo: string, lineup: Bateador[]) => {
    let md = `# Reporte de Scouting — Equipo ${equipo}\n\n`;
    md += `**Partido:** ${partido.descripcion}  \n`;
    md += `**Fecha:** ${new Date(partido.fecha).toLocaleDateString('es-AR')}\n\n`;
    md += `---\n\n`;

    for (const b of lineup) {
      const stats = calcularEstadisticas(b.id, estado.turnosAlBate);
      if (stats.turnosAlBate === 0) continue;
      md += `## #${b.numero} ${b.apellido}${b.nombre ? `, ${b.nombre}` : ''}\n\n`;
      const avg = stats.promedio.toFixed(3).replace('0.', '.');
      const turnoList = estado.turnosAlBate.filter(t => t.bateadorId === b.id);
      const asistencia = turnoList.filter(t => t.detalleOut?.tipo === 'asistencia').length;
      const fly = turnoList.filter(t => t.detalleOut?.tipo === 'fly').length;
      const afCount = asistencia + fly;
      md += `AB: ${stats.turnosAlBate} | H: ${stats.hits} | AVG: ${avg} | K: ${stats.strikeoutsSwinging + stats.strikeoutsLooking} | BB/HBP: ${stats.basesPorBolas} | A/F: ${afCount}\n\n`;
      // Zonas calientes
      const calientes = ([1,2,3,4,5,6,7,8] as const)
        .filter((z) => stats.porZona[z].hits > 0)
        .map((z) => `Zona ${z} (${stats.porZona[z].hits} H)`)
        .join(', ');
      if (calientes) md += `**Zonas calientes:** ${calientes}\n\n`;
      md += `---\n\n`;
    }

    md += `*Generado por MiScout v1.1*\n`;
    setPreview(md);
    setModo('equipo');
    dispatch({ type: 'SET_MODO_ACUMULADO', payload: false });
  };

  const generarEquipoAcumulado = async (equipo: string, lineup: Bateador[]) => {
    setCargando(true);
    try {
      let md = `# Reporte de Scouting Acumulado — Equipo ${equipo}\n\n`;
      md += `*Datos agregados de todos los partidos registrados.*\n\n`;
      md += `---\n\n`;

      for (const b of lineup) {
        const params = new URLSearchParams({
          apellido: b.apellido,
          numero: b.numero,
          equipo: b.equipo || ''
        });
        const res = await fetch(`/api/jugador/stats?${params.toString()}`);
        if (!res.ok) continue;
        const data = await res.json();
        const turnosAcumulados: TurnoAlBate[] = data.turnos || [];
        const turnosHomogeneos = turnosAcumulados.map(t => ({...t, bateadorId: b.id}));
        const stats = calcularEstadisticas(b.id, turnosHomogeneos);
        
        if (stats.turnosAlBate === 0) continue;
        md += `## #${b.numero} ${b.apellido}${b.nombre ? `, ${b.nombre}` : ''}\n\n`;
        const avg = stats.promedio.toFixed(3).replace('0.', '.');
        const turnoList = turnosHomogeneos;
        const asistencia = turnoList.filter(t => t.detalleOut?.tipo === 'asistencia').length;
        const fly = turnoList.filter(t => t.detalleOut?.tipo === 'fly').length;
        const afCount = asistencia + fly;
        md += `AB: ${stats.turnosAlBate} | H: ${stats.hits} | AVG: ${avg} | K: ${stats.strikeoutsSwinging + stats.strikeoutsLooking} | BB/HBP: ${stats.basesPorBolas} | A/F: ${afCount}\n\n`;
        
        const calientes = ([1,2,3,4,5,6,7,8] as const)
          .filter((z) => stats.porZona[z].hits > 0)
          .map((z) => `Zona ${z} (${stats.porZona[z].hits} H)`)
          .join(', ');
        if (calientes) md += `**Zonas calientes:** ${calientes}\n\n`;
        md += `---\n\n`;
      }

      md += `*Generado por MiScout v1.1*\n`;
      setPreview(md);
      setModo('equipo_acumulado');
      dispatch({ type: 'SET_MODO_ACUMULADO', payload: true });
    } catch (e) {
      console.error(e);
      alert('Error cargando historial acumulado del equipo');
    }
    setCargando(false);
  };

  const descargar = () => {
    if (!preview) return;
    if (modo === 'equipo') {
      descargarMD(preview, `scout_equipo.md`);
    } else if (modo === 'equipo_acumulado') {
      descargarMD(preview, `scout_equipo_acumulado.md`);
    } else if (modo === 'acumulado') {
      const b = todos.find((x) => x.id === selId);
      if (!b) return;
      descargarMD(preview, `scout_acumulado_${slugify(b.apellido)}_${slugify(b.nombre || 'x')}.md`);
    } else {
      const b = todos.find((x) => x.id === selId);
      if (!b) return;
      descargarMD(preview, `scout_${slugify(b.apellido)}_${slugify(b.nombre || 'x')}.md`);
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
        <p className="section-title" style={{ marginBottom: 4 }}>Generar reporte</p>

        {/* Individual */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontWeight: 700, fontSize: '0.88rem' }}>Jugador</p>
          <select
            className="input"
            value={selId}
            onChange={(e) => dispatch({ type: 'SELECCIONAR_JUGADOR', payload: e.target.value })}
          >
            <option value="" disabled hidden>— Selecciona un jugador —</option>
            {todos.map((b) => (
              <option key={b.id} value={b.id}>
                #{b.numero} {b.apellido}{b.nombre ? `, ${b.nombre}` : ''} - {b.equipo ? b.equipo.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()) : ''}
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: 8, background: 'var(--bg-elevated)', padding: 4, borderRadius: 8 }}>
            <button
              className={`btn btn-sm ${modo !== 'acumulado' ? 'btn-primary' : ''}`}
              disabled={!selId || cargando}
              onClick={() => {
                const b = todos.find((x) => x.id === selId);
                if (b) generarIndividual(b);
              }}
              style={{
                flex: 1,
                background: (!selId || cargando) ? 'transparent' : (modo !== 'acumulado' ? '' : 'transparent'),
                color: (!selId || cargando) ? 'var(--text-secondary)' : (modo !== 'acumulado' ? '' : 'var(--text-secondary)'),
                opacity: (!selId || cargando) ? 0.5 : 1
              }}
            >
              Este partido
            </button>
            <button
              className={`btn btn-sm ${modo === 'acumulado' ? 'btn-primary' : ''}`}
              disabled={!selId || cargando}
              onClick={() => {
                const b = todos.find((x) => x.id === selId);
                if (b) generarAcumulado(b);
              }}
              style={{
                flex: 1,
                background: (!selId || cargando) ? 'transparent' : (modo === 'acumulado' ? '' : 'transparent'),
                color: (!selId || cargando) ? 'var(--text-secondary)' : (modo === 'acumulado' ? '' : 'var(--text-secondary)'),
                opacity: (!selId || cargando) ? 0.5 : 1
              }}
            >
              {cargando ? 'Cargando...' : 'Acumulado'}
            </button>
          </div>
        </div>

        {/* Equipo */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontWeight: 700, fontSize: '0.88rem' }}>Equipo</p>
          <select
            className="input"
            value={selEquipo}
            onChange={(e) => setSelEquipo(e.target.value as 'visitante' | 'local')}
          >
            <option value="" disabled hidden>— Selecciona un equipo —</option>
            <option value="visitante">{partido.visitante} (Visitante)</option>
            <option value="local">{partido.local} (Local)</option>
          </select>
          <div style={{ display: 'flex', gap: 8, background: 'var(--bg-elevated)', padding: 4, borderRadius: 8 }}>
            <button
              className={`btn btn-sm ${modo !== 'equipo_acumulado' ? 'btn-primary' : ''}`}
              disabled={!selEquipo || cargando}
              onClick={() => {
                if (selEquipo === 'visitante') generarEquipo(partido.visitante, estado.lineupVisitante);
                else if (selEquipo === 'local') generarEquipo(partido.local, estado.lineupLocal);
              }}
              style={{
                flex: 1,
                background: (!selEquipo || cargando) ? 'transparent' : (modo !== 'equipo_acumulado' ? '' : 'transparent'),
                color: (!selEquipo || cargando) ? 'var(--text-secondary)' : (modo !== 'equipo_acumulado' ? '' : 'var(--text-secondary)'),
                opacity: (!selEquipo || cargando) ? 0.5 : 1
              }}
            >
              Este partido
            </button>
            <button
              className={`btn btn-sm ${modo === 'equipo_acumulado' ? 'btn-primary' : ''}`}
              disabled={!selEquipo || cargando}
              onClick={() => {
                if (selEquipo === 'visitante') generarEquipoAcumulado(partido.visitante, estado.lineupVisitante);
                else if (selEquipo === 'local') generarEquipoAcumulado(partido.local, estado.lineupLocal);
              }}
              style={{
                flex: 1,
                background: (!selEquipo || cargando) ? 'transparent' : (modo === 'equipo_acumulado' ? '' : 'transparent'),
                color: (!selEquipo || cargando) ? 'var(--text-secondary)' : (modo === 'equipo_acumulado' ? '' : 'var(--text-secondary)'),
                opacity: (!selEquipo || cargando) ? 0.5 : 1
              }}
            >
              {cargando ? 'Cargando...' : 'Acumulado'}
            </button>
          </div>
        </div>
      </div>

      {/* Vista previa */}
      {preview && (
        <div style={{ padding: '0 16px 16px' }}>
          <p className="section-title" style={{ marginBottom: 8 }}>Vista previa</p>
          <div
            className="card"
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '0.8rem',
              lineHeight: 1.6,
              maxHeight: 400,
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              color: 'var(--text-secondary)',
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
            Descargar .md
          </button>
          <p className="text-xs text-secondary" style={{ textAlign: 'center', marginTop: 6 }}>
            El archivo se guardará en tu dispositivo
          </p>
        </div>
      )}
    </div>
  );
}
