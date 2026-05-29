'use client';

import { useState } from 'react';
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
  const { estado } = useScout();
  const [selId, setSelId] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const [modo, setModo] = useState<'individual' | 'equipo' | 'acumulado' | null>(null);
  const [cargando, setCargando] = useState(false);

  const todos = [...(estado.lineupVisitante || []), ...(estado.lineupLocal || [])];
  const partido = estado.partido;

  if (!partido) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">📄</div>
        <div className="empty-state__title">Sin partido activo</div>
        <p className="empty-state__text">Iniciá un partido y registrá al menos un turno al bate para generar reportes.</p>
      </div>
    );
  }

  const generarIndividual = (b: Bateador) => {
    const stats = calcularEstadisticas(b.id, estado.turnosAlBate);
    const md = generarReporteMD(b, stats, estado.turnosAlBate, partido);
    setPreview(md);
    setModo('individual');
    setSelId(b.id);
  };

  const generarAcumulado = async (b: Bateador) => {
    setCargando(true);
    try {
      const params = new URLSearchParams({
        apellido: b.apellido,
        numero: b.numero,
        equipo: b.equipo
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
      md += `| AB | H | 2B | 3B | HR | KS | KL | BB/HBP | OUT | AVG |\n`;
      md += `|----|---|----|----|----|----|----|----|-----|-----|\n`;
      md += `| ${stats.turnosAlBate} | ${stats.hits} | ${stats.dobles} | ${stats.triples} | ${stats.homeRuns} | ${stats.strikeoutsSwinging} | ${stats.strikeoutsLooking} | ${stats.basesPorBolas} | ${stats.outs} | ${avg} |\n\n`;

      md += `---\n\n*Para más detalles por zona, consultá la sección de Estadísticas.*\n\n*Generado por Mi Scout v1.1*\n`;
      setPreview(md);
      setModo('acumulado');
      setSelId(b.id);
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
      md += `AB: ${stats.turnosAlBate} | H: ${stats.hits} | AVG: ${avg} | KS: ${stats.strikeoutsSwinging} | KL: ${stats.strikeoutsLooking} | BB/HBP: ${stats.basesPorBolas} | A/F: ${afCount}\n\n`;
      // Zonas calientes
      const calientes = ([1,2,3,4,5,6,7,8] as const)
        .filter((z) => stats.porZona[z].hits > 0)
        .map((z) => `Zona ${z} (${stats.porZona[z].hits} H)`)
        .join(', ');
      if (calientes) md += `**Zonas calientes:** ${calientes}\n\n`;
      md += `---\n\n`;
    }

    md += `*Generado por Mi Scout v1.1*\n`;
    setPreview(md);
    setModo('equipo');
  };

  const descargar = () => {
    if (!preview) return;
    if (modo === 'equipo') {
      descargarMD(preview, `scout_equipo.md`);
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
          <p style={{ fontWeight: 700, fontSize: '0.88rem' }}>👤 Reporte del jugador</p>
          <select
            className="input"
            value={selId}
            onChange={(e) => setSelId(e.target.value)}
          >
            <option value="">— Seleccioná un bateador —</option>
            {todos.map((b) => (
              <option key={b.id} value={b.id}>
                #{b.numero} {b.apellido}{b.nombre ? `, ${b.nombre}` : ''}
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-primary"
              disabled={!selId || cargando}
              onClick={() => {
                const b = todos.find((x) => x.id === selId);
                if (b) generarIndividual(b);
              }}
              style={!selId || cargando ? { opacity: 0.5, flex: 1 } : { flex: 1 }}
            >
              Partido actual
            </button>
            <button
              className="btn btn-primary"
              disabled={!selId || cargando}
              onClick={() => {
                const b = todos.find((x) => x.id === selId);
                if (b) generarAcumulado(b);
              }}
              style={!selId || cargando ? { opacity: 0.5, flex: 1, background: 'var(--accent)', color: '#000' } : { flex: 1, background: 'var(--accent)', color: '#000' }}
            >
              {cargando ? 'Cargando...' : 'Acumulado'}
            </button>
          </div>
        </div>

        {/* Equipo */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>👥 Reporte del equipo</p>
          <button className="btn btn-primary btn-full" onClick={() => generarEquipo(partido.visitante, estado.lineupVisitante)}>
            Generar reporte completo — {partido.visitante} (Visitante)
          </button>
          <button className="btn btn-primary btn-full" onClick={() => generarEquipo(partido.local, estado.lineupLocal)}>
            Generar reporte completo — {partido.local} (Local)
          </button>
        </div>
      </div>

      {/* Vista previa */}
      {preview && (
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <p className="section-title">Vista previa</p>
            <button
              className="btn btn-primary btn-sm"
              onClick={descargar}
            >
              Descargar .md
            </button>
          </div>
          <div
            className="card"
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '0.72rem',
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
            className="btn btn-primary btn-lg btn-full"
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
