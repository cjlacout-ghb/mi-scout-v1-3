'use client';

import React, { useState, useEffect } from 'react';
import { useScout } from '@/context/ScoutContext';
import ZonaStrikeComponent from '@/components/ZonaStrike';
import { calcularEstadisticas } from '@/lib/storage';
import type { Bateador, ZonaStrike, TurnoAlBate } from '@/lib/types';

function calcHeatMap(bateadorId: string, turnos: TurnoAlBate[]): Partial<Record<ZonaStrike, number>> {
  const stats = calcularEstadisticas(bateadorId, turnos);
  const mapa: Partial<Record<ZonaStrike, number>> = {};
  
  for (let z = 1; z <= 8; z++) {
    const d = stats.porZona[z as ZonaStrike];
    if (d.contacto > 0) {
      // Si hubo contacto (Hit o Out en juego), evaluamos el AVG en esa zona.
      mapa[z as ZonaStrike] = d.hits / d.contacto;
    } else if (d.pitches > 0 && d.hits === 0) {
      // Si hubo pitcheos pero no hits ni contacto (ej. strikes/bolas), es zona fría.
      mapa[z as ZonaStrike] = 0;
    } else {
      // Sin pitcheos = transparente
      mapa[z as ZonaStrike] = -1;
    }
  }
  return mapa;
}

function valueColor(val: number | null): string {
  if (val === null) return 'var(--text-secondary)';
  const stops = [
    [0.0,  [39,  174, 96 ]],  // cold  — green
    [0.25, [46,  173, 150]],  // cool  — teal
    [0.5,  [52,  152, 219]],  // neutral — blue
    [0.75, [155, 89,  182]],  // warm  — purple
    [1.0,  [231, 76,  60 ]],  // hot   — red
  ] as [number, number[]][];

  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (val >= stops[i][0] && val <= stops[i + 1][0]) {
      lo = stops[i]; hi = stops[i + 1]; break;
    }
  }
  const t = (val - lo[0]) / (hi[0] - lo[0]);
  const r = Math.round(lo[1][0] + t * (hi[1][0] - lo[1][0]));
  const g = Math.round(lo[1][1] + t * (hi[1][1] - lo[1][1]));
  const b = Math.round(lo[1][2] + t * (hi[1][2] - lo[1][2]));
  return `rgb(${r},${g},${b})`;
}

export default function StatsPage() {
  const { estado, bateadorActual } = useScout();
  const todos = [...(estado.lineupVisitante || []), ...(estado.lineupLocal || [])];
  const activos = todos.filter((b) => b.activo);

  const selId = estado.jugadorSeleccionadoId || bateadorActual?.id || null;
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
        <p className="empty-state__text">Inicia un partido para ver las estadísticas.</p>
      </div>
    );
  }

  const turnosParaStats = modoAcumulado 
    ? turnosAcumulados.map(t => ({...t, bateadorId: bateadorSel?.id || ''}))
    : estado.turnosAlBate;

  const stats = bateadorSel
    ? calcularEstadisticas(bateadorSel.id, turnosParaStats)
    : null;

  const heatMap = bateadorSel ? calcHeatMap(bateadorSel.id, turnosParaStats) : undefined;

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
          onChange={(e) => {
            const id = e.target.value || null;
            dispatch({ type: 'SELECCIONAR_JUGADOR', payload: id });
          }}
          style={{ marginBottom: 12 }}
        >
          {todos.map((b) => (
            <option key={b.id} value={b.id}>
              #{b.numero} {b.apellido}{b.nombre ? `, ${b.nombre}` : ''} - {b.equipo ? b.equipo.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()) : ''} {!b.activo ? '(sale)' : ''}
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
              { label: 'AB', value: stats.turnosAlBate, color: '#FFFFFF' },
              { label: 'H',  value: stats.hits,  color: 'var(--danger)' },
              { label: 'A/F',value: stats.outs, color: 'var(--success)' },
              { label: 'KS/KL', value: stats.strikeoutsSwinging + stats.strikeoutsLooking, color: 'var(--success)' },
              { label: 'BB/HBP', value: stats.basesPorBolas, color: 'var(--info)' },
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
            <span className="heatmap-legend__label">COLD</span>
            <div className="heatmap-legend__bar" />
            <span className="heatmap-legend__label">HOT</span>
          </div>

          {/* Zona heat map */}
          <ZonaStrikeComponent
            onZonaClick={() => {}}
            heatMap={heatMap}
            zoneStats={stats.porZona}
            ladoBateo={bateadorSel.ladoBateo}
          />

          {/* Tabla por zona */}
          <div style={{ padding: '4px 16px 16px' }}>
            <p className="section-title" style={{ marginBottom: 8 }}>Desglose por zona</p>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Zona</th>
                    <th style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Pitches</th>
                    <th style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>AB</th>
                    <th style={{ textAlign: 'center' }}>Hits</th>
                    <th style={{ textAlign: 'center' }}>Outs</th>
                    <th style={{ textAlign: 'center' }}>AVG</th>
                  </tr>
                </thead>
                <tbody>
                  {([1,2,3,4,5,6,7,8] as ZonaStrike[]).map((z) => {
                    const d = stats.porZona[z];
                    const abZona = d.hits + d.outs + d.ks + d.kl;
                    const avgZonaVal = abZona > 0 ? (d.hits / abZona) : null;
                    const avgZona = abZona > 0 ? avgZonaVal!.toFixed(3).replace('0.', '.') : '---';
                    return (
                      <React.Fragment key={z}>
                      <tr>
                        <td>
                          <span>Zona {z}</span>
                        </td>
                        <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{d.pitches}</td>
                        <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{abZona}</td>
                        <td style={{ textAlign: 'center', color: d.hits > 0 ? 'var(--danger)' : 'var(--text-secondary)' }}>
                          {d.hits}
                        </td>
                        <td style={{ textAlign: 'center', color: (d.outs + d.ks + d.kl) > 0 ? 'var(--success)' : 'var(--text-secondary)' }}>
                          {d.outs + d.ks + d.kl}
                        </td>
                        <td style={{ textAlign: 'center', color: valueColor(avgZonaVal), fontWeight: avgZonaVal !== null ? 600 : 'normal' }}>
                          {avgZona}
                        </td>
                      </tr>
                      {z === 4 && (
                        <tr>
                          <td colSpan={6} style={{ padding: 0, height: 2, background: 'var(--text-muted)' }} />
                        </tr>
                      )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla por tipo de pitch */}
          <div style={{ padding: '0 16px 16px' }}>
            <p className="section-title" style={{ marginBottom: 8 }}>Por tipo de pitch</p>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Pitch</th>
                    <th style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Vistos</th>
                    <th style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>AB</th>
                    <th style={{ textAlign: 'center' }}>K%</th>
                    <th style={{ textAlign: 'center' }}>AVG</th>
                  </tr>
                </thead>
                <tbody>
                  {(['drop', 'riser', 'curva', 'cambio', 'screw', 'otro'] as const)
                    .map((p) => ({ p, d: stats.porPitch[p] }))
                    .filter(({ d }) => d.pitches > 0)
                    .sort((a, b) => b.d.pitches - a.d.pitches)
                    .map(({ p, d }) => {
                      const avgPitchVal = d.ab > 0 ? (d.hits / d.ab) : null;
                      const avgPitch = d.ab > 0
                        ? avgPitchVal!.toFixed(3).replace('0.', '.')
                        : '---';
                      const kPctVal = d.pitches > 0 ? ((d.ks + d.kl) / d.pitches) : null;
                      const kPct = d.pitches > 0
                        ? Math.round(kPctVal! * 100) + '%'
                        : '---';
                      return (
                        <tr key={p}>
                          <td style={{ textTransform: 'capitalize', fontWeight: 700 }}>{p}</td>
                          <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{d.pitches}</td>
                          <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{d.ab}</td>
                          <td style={{ textAlign: 'center', color: valueColor(kPctVal), fontWeight: kPctVal !== null ? 600 : 'normal' }}>
                            {kPct}
                          </td>
                          <td style={{ textAlign: 'center', color: valueColor(avgPitchVal), fontWeight: avgPitchVal !== null ? 600 : 'normal' }}>
                            {avgPitch}
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
