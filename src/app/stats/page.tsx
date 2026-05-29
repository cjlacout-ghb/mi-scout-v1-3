'use client';

import { useState, useEffect } from 'react';
import { useScout } from '@/context/ScoutContext';
import ZonaStrikeComponent from '@/components/ZonaStrike';
import { calcularEstadisticas } from '@/lib/storage';
import type { Bateador, ZonaStrike, TurnoAlBate } from '@/lib/types';

function calcHeatMap(bateadorId: string, turnos: TurnoAlBate[]): Partial<Record<ZonaStrike, number>> {
  const stats = calcularEstadisticas(bateadorId, turnos);
  const mapa: Partial<Record<ZonaStrike, number>> = {};
  let maxPitches = 0;
  for (let z = 1; z <= 8; z++) {
    maxPitches = Math.max(maxPitches, stats.porZona[z as ZonaStrike].pitches);
  }
  if (maxPitches === 0) return mapa;
  for (let z = 1; z <= 8; z++) {
    const d = stats.porZona[z as ZonaStrike];
    if (d.pitches === 0) { mapa[z as ZonaStrike] = 0; continue; }
    mapa[z as ZonaStrike] = d.hits / d.pitches;
  }
  return mapa;
}

export default function StatsPage() {
  const { estado } = useScout();
  const todos = [...(estado.lineupVisitante || []), ...(estado.lineupLocal || [])];
  const activos = todos.filter((b) => b.activo);

  const [selId, setSelId] = useState<string | null>(null);
  const [modoAcumulado, setModoAcumulado] = useState(false);
  
  const [turnosAcumulados, setTurnosAcumulados] = useState<TurnoAlBate[]>([]);
  const [cargandoAcumulado, setCargandoAcumulado] = useState(false);

  const bateadorSel: Bateador | null =
    todos.find((b) => b.id === selId) ??
    activos[0] ??
    null;

  useEffect(() => {
    if (modoAcumulado && bateadorSel) {
      setCargandoAcumulado(true);
      const params = new URLSearchParams({
        apellido: bateadorSel.apellido,
        numero: bateadorSel.numero,
        equipo: bateadorSel.equipo
      });
      fetch(`/api/jugador/stats?${params.toString()}`)
        .then(r => r.json())
        .then(data => {
          if (data.turnos) setTurnosAcumulados(data.turnos);
          setCargandoAcumulado(false);
        })
        .catch(() => setCargandoAcumulado(false));
    }
  }, [modoAcumulado, bateadorSel]);

  if (!estado.partido) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">📊</div>
        <div className="empty-state__title">Sin partido activo</div>
        <p className="empty-state__text">Iniciá un partido para ver las estadísticas.</p>
      </div>
    );
  }

  const turnosAMostrar = modoAcumulado ? turnosAcumulados : estado.turnosAlBate;

  const stats = bateadorSel
    ? calcularEstadisticas(bateadorSel.id, turnosAMostrar.map(t => ({...t, bateadorId: bateadorSel.id})))
    : null;

  const heatMap = bateadorSel ? calcHeatMap(bateadorSel.id, turnosAMostrar.map(t => ({...t, bateadorId: bateadorSel.id}))) : undefined;

  const avg = stats && stats.turnosAlBate > 0
    ? stats.promedio.toFixed(3).replace('0.', '.')
    : '---';

  return (
    <div style={{ paddingBottom: 16 }}>
      {/* Selector de bateador */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <label className="label">Bateador</label>
        <select
          className="input"
          value={selId ?? bateadorSel?.id ?? ''}
          onChange={(e) => setSelId(e.target.value || null)}
          style={{ fontWeight: 600, marginBottom: 12 }}
        >
          {todos.map((b) => (
            <option key={b.id} value={b.id}>
              #{b.numero} {b.apellido}{b.nombre ? `, ${b.nombre}` : ''} {!b.activo ? '(sale)' : ''}
            </option>
          ))}
        </select>

        {/* Toggle Acumulado */}
        <div style={{ display: 'flex', gap: 8, background: 'var(--bg-elevated)', padding: 4, borderRadius: 8 }}>
          <button
            className={`btn btn-sm ${!modoAcumulado ? 'btn-primary' : ''}`}
            style={{ flex: 1, background: !modoAcumulado ? '' : 'transparent', color: !modoAcumulado ? '' : 'var(--text-secondary)' }}
            onClick={() => setModoAcumulado(false)}
          >
            Este partido
          </button>
          <button
            className={`btn btn-sm ${modoAcumulado ? 'btn-primary' : ''}`}
            style={{ flex: 1, background: modoAcumulado ? '' : 'transparent', color: modoAcumulado ? '' : 'var(--text-secondary)' }}
            onClick={() => setModoAcumulado(true)}
          >
            Acumulado
          </button>
        </div>
      </div>

      {!bateadorSel && (
        <div className="empty-state">
          <p className="text-secondary">Cargá bateadores en el Line-Up.</p>
        </div>
      )}

      {cargandoAcumulado && modoAcumulado && (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>
          Cargando stats acumuladas...
        </div>
      )}

      {!cargandoAcumulado && bateadorSel && stats && (
        <>
          {/* Stats cards */}
          <div className="stats-row" style={{ paddingTop: 12 }}>
            {[
              { label: 'AB', value: stats.turnosAlBate },
              { label: 'H',  value: stats.hits,  color: 'var(--danger)' },
              { label: 'KS', value: stats.strikeoutsSwinging, color: 'var(--success)' },
              { label: 'KL', value: stats.strikeoutsLooking,  color: 'var(--success)' },
              { label: 'BB/HBP', value: stats.basesPorBolas, color: 'var(--info)' },
              { label: 'OUT',value: stats.outs },
              { label: 'AVG',value: avg, color: 'var(--accent)' },
            ].map(({ label, value, color }) => (
              <div className="stat-card" key={label}>
                <span className="stat-card__value" style={color ? { color } : undefined}>{value}</span>
                <span className="stat-card__label">{label}</span>
              </div>
            ))}
          </div>

          {/* Leyenda heat map */}
          <div className="heatmap-legend">
            <span className="heatmap-legend__label">FRÍO</span>
            <div className="heatmap-legend__bar" />
            <span className="heatmap-legend__label">CALIENTE</span>
          </div>

          {/* Zona heat map */}
          <ZonaStrikeComponent
            onZonaClick={() => {}}
            heatMap={heatMap}
          />

          {/* Tabla por zona */}
          <div style={{ padding: '4px 16px 16px' }}>
            <p className="section-title" style={{ marginBottom: 8 }}>Desglose por zona</p>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Zona</th>
                    <th style={{ textAlign: 'center' }}>Pitches</th>
                    <th style={{ textAlign: 'center' }}>Hits</th>
                    <th style={{ textAlign: 'center' }}>Outs</th>
                    <th style={{ textAlign: 'center' }}>% Cont.</th>
                  </tr>
                </thead>
                <tbody>
                  {([1,2,3,4,5,6,7,8] as ZonaStrike[]).map((z) => {
                    const d = stats.porZona[z];
                    const pct = d.pitches > 0 ? Math.round((d.contacto / d.pitches) * 100) : 0;
                    return (
                      <tr key={z}>
                        <td>
                          <span style={{ fontWeight: 700 }}>Zona {z}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>{d.pitches}</td>
                        <td style={{ textAlign: 'center', color: d.hits > 0 ? 'var(--danger)' : 'var(--text-secondary)' }}>
                          {d.hits}
                        </td>
                        <td style={{ textAlign: 'center', color: d.outs > 0 ? 'var(--success)' : 'var(--text-secondary)' }}>
                          {d.outs}
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: pct > 50 ? 'var(--danger)' : pct > 25 ? 'var(--warning)' : 'var(--text-secondary)' }}>
                          {d.pitches > 0 ? `${pct}%` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
