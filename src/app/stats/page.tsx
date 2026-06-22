'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useScout } from '@/context/ScoutContext';
import ZonaStrikeComponent from '@/components/ZonaStrike';
import { calcularEstadisticas } from '@/lib/storage';
import type { Bateador, ZonaStrike, TurnoAlBate } from '@/lib/types';



function valueColor(val: number | null): string {
  if (val === null) return 'var(--text-secondary)';
  const stops = [
    [0.0,  [98,  187, 70 ]],  // cold  — #62BB46
    [0.25, [178, 211, 74 ]],  // cool  — #B2D34A
    [0.5,  [255, 194, 14 ]],  // neutral — #FFC20E
    [0.75, [245, 130, 32 ]],  // warm  — #F58220
    [1.0,  [241, 91,  64 ]],  // hot   — #F15B40
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

import { db } from '@/lib/dbClient';

export default function StatsPage() {
  const { estado, dispatch, bateadorActual } = useScout();
  const todos = [...(estado.lineupVisitante || []), ...(estado.lineupLocal || [])];
  const activos = todos.filter((b) => b.activo);

  const selId = estado.jugadorSeleccionadoId || bateadorActual?.id || null;
  const modoAcumulado = estado.modoAcumuladoGlobal ?? false;
  const setModoAcumulado = (val: boolean) => dispatch({ type: 'SET_MODO_ACUMULADO', payload: val });
  const [ordenarPorAvg, setOrdenarPorAvg] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);
  
  const [turnosAcumulados, setTurnosAcumulados] = useState<TurnoAlBate[]>([]);
  const [cargandoAcumulado, setCargandoAcumulado] = useState(false);
  const [avgAcumuladoMap, setAvgAcumuladoMap] = useState<Map<string, number>>(new Map());
  const [cargandoAvgAcumulado, setCargandoAvgAcumulado] = useState(false);

  // AVG rápido por bateador (solo partido actual)
  const avgMap = new Map<string, number>();
  for (const b of todos) {
    const bt = estado.turnosAlBate.filter(t => t.bateadorId === b.id);
    const ab = bt.length;
    const h  = bt.filter(t => t.resultado === 'HIT').length;
    avgMap.set(b.id, ab > 0 ? h / ab : -1);
  }

  // Carga AVG acumulado de TODOS los bateadores cuando se activa el modo acumulado + ordenarPorAvg
  useEffect(() => {
    if (!modoAcumulado || !ordenarPorAvg || todos.length === 0) {
      setAvgAcumuladoMap(new Map());
      return;
    }
    setCargandoAvgAcumulado(true);
    Promise.all(
      todos.map(async (bateador) => {
        const batters = await db.bateadores
          .where('[apellido+numero+equipo]')
          .equals([bateador.apellido, bateador.numero, bateador.equipo])
          .toArray();
        const ids = batters.map(b => b.id);
        const turnos = ids.length > 0
          ? await db.turnos_al_bate.where('bateadorId').anyOf(ids).toArray()
          : [];
        const ab = turnos.length;
        const h  = turnos.filter(t => t.resultado === 'HIT').length;
        return { id: bateador.id, avg: ab > 0 ? h / ab : -1 };
      })
    ).then(results => {
      const map = new Map<string, number>();
      results.forEach(r => map.set(r.id, r.avg));
      setAvgAcumuladoMap(map);
      setCargandoAvgAcumulado(false);
    }).catch(err => {
      console.error('Error cargando AVG acumulado:', err);
      setCargandoAvgAcumulado(false);
    });
  }, [modoAcumulado, ordenarPorAvg, todos.length]);

  const activeAvgMap = modoAcumulado ? avgAcumuladoMap : avgMap;

  const todosOrdenados = ordenarPorAvg
    ? (() => {
        const equipos = [...new Set(todos.map(b => b.equipo))];
        return equipos.flatMap(eq =>
          todos
            .filter(b => b.equipo === eq)
            .sort((a, b) => (activeAvgMap.get(b.id) ?? -1) - (activeAvgMap.get(a.id) ?? -1))
        );
      })()
    : todos;

  const bateadorSel: Bateador | null =
    todos.find((b) => b.id === selId) ??
    activos[0] ??
    null;

  useEffect(() => {
    if (modoAcumulado && bateadorSel) {
      setCargandoAcumulado(true);
      db.bateadores
        .where('[apellido+numero+equipo]')
        .equals([bateadorSel.apellido, bateadorSel.numero, bateadorSel.equipo])
        .toArray()
        .then(batters => {
          const ids = batters.map(b => b.id);
          return db.turnos_al_bate.where('bateadorId').anyOf(ids).toArray();
        })
        .then(turnos => {
          setTurnosAcumulados(turnos);
          setCargandoAcumulado(false);
        })
        .catch((err) => {
          console.error('Error fetching accumulated stats:', err);
          setCargandoAcumulado(false);
        });
    }
  }, [modoAcumulado, bateadorSel?.id]);

  if (!estado.partido) {
    return (
      <div className="empty-state">

        <div className="empty-state__title">Sin partido activo</div>
        <p className="empty-state__text">Inicia un partido para ver las estadísticas. O selecciona desde el Historial.</p>
      </div>
    );
  }

  const turnosParaStats = modoAcumulado 
    ? turnosAcumulados.map(t => ({...t, bateadorId: bateadorSel?.id || ''}))
    : estado.turnosAlBate;

  const stats = bateadorSel
    ? calcularEstadisticas(bateadorSel.id, turnosParaStats)
    : null;

  // Derivar zona real desde coordenadas canónicas (catcher) cuando existen,
  // porque el campo t.zona pudo haberse capturado incorrectamente por overlap CSS.
  // Layout catcher: inner zone ocupa 20%-80% en ambos ejes.
  //   Zona 3: top-left inner   (x<0.5, y<0.5, dentro de inner)
  //   Zona 4: top-right inner  (x>=0.5, y<0.5, dentro de inner)
  //   Zona 1: bottom-left inner (x<0.5, y>=0.5, dentro de inner)
  //   Zona 2: bottom-right inner(x>=0.5, y>=0.5, dentro de inner)
  //   Zona 7/8/5/6: corners (fuera de inner)
  function zonaDesdeCoords(x: number, y: number): ZonaStrike {
    const inner = x >= 0.2 && x <= 0.8 && y >= 0.2 && y <= 0.8;
    const left = x < 0.5;
    const top = y < 0.5;
    if (inner) {
      if (top && left) return 3;
      if (top && !left) return 4;
      if (!top && left) return 1;
      return 2;
    }
    if (top && left) return 7;
    if (top && !left) return 8;
    if (!top && left) return 5;
    return 6;
  }

  function zonaReal(t: TurnoAlBate): ZonaStrike {
    if (t.coordenadas) return zonaDesdeCoords(t.coordenadas.x, t.coordenadas.y);
    return t.zona;
  }

  const turnosBateador = bateadorSel
    ? turnosParaStats.filter(t => t.bateadorId === bateadorSel.id)
    : [];

  const zonasDir = (() => {
    const data = {} as Record<ZonaStrike, { pitches: number; hits: number; outs: number; contacto: number; ks: number; kl: number; bb: number; ab: number }>;
    for (let z = 1; z <= 8; z++) {
      const zt = turnosBateador.filter(t => zonaReal(t) === z);
      const hits = zt.filter(t => t.resultado === 'HIT').length;
      const outs = zt.filter(t => t.resultado === 'OUT').length;
      const ks   = zt.filter(t => t.resultado === 'KS').length;
      const kl   = zt.filter(t => t.resultado === 'KL').length;
      const bb   = zt.filter(t => t.resultado === 'BB' || t.resultado === 'HBP').length;
      data[z as ZonaStrike] = { pitches: zt.length, hits, outs, contacto: hits + outs, ks, kl, bb, ab: hits + outs + ks + kl };
    }
    return data;
  })();

  // Heat map: intensidad = hits / ab (0 = frío, 1 = caliente, -1 = sin datos)
  const heatMap: Partial<Record<ZonaStrike, number>> = {};
  for (let z = 1; z <= 8; z++) {
    const d = zonasDir[z as ZonaStrike];
    heatMap[z as ZonaStrike] = d.ab > 0 ? d.hits / d.ab : -1;
  }

  const avg = stats && stats.turnosAlBate > 0
    ? stats.promedio.toFixed(3).replace('0.', '.')
    : '---';

  return (
    <div style={{ paddingBottom: 16 }}>
      {/* Selector de bateador */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <label className="label" style={{ margin: 0 }}>Bateador</label>
          <div style={{ display: 'flex', gap: 4, background: 'var(--bg-elevated)', padding: 3, borderRadius: 6 }}>
            <button
              className="btn btn-sm"
              style={{ padding: '2px 8px', fontSize: '0.65rem', background: !ordenarPorAvg ? 'var(--accent)' : 'transparent', color: !ordenarPorAvg ? '#000' : 'var(--text-secondary)', border: !ordenarPorAvg ? '1px solid var(--accent)' : 'none', fontWeight: !ordenarPorAvg ? 'bold' : 'normal' }}
              onClick={() => setOrdenarPorAvg(false)}
            >
              Orden al bate
            </button>
            <button
              className="btn btn-sm"
              style={{ padding: '2px 8px', fontSize: '0.65rem', background: ordenarPorAvg ? 'var(--accent)' : 'transparent', color: ordenarPorAvg ? '#000' : 'var(--text-secondary)', border: ordenarPorAvg ? '1px solid var(--accent)' : 'none', fontWeight: ordenarPorAvg ? 'bold' : 'normal' }}
              onClick={() => setOrdenarPorAvg(true)}
            >
              AVG
            </button>
          </div>
        </div>
        {/* Custom dropdown con AVG coloreado */}
        <div ref={dropdownRef} style={{ position: 'relative', marginBottom: 12 }}>
          {/* Trigger */}
          <div
            className="input"
            onClick={() => setDropdownOpen(o => !o)}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              cursor: 'pointer', userSelect: 'none',
              border: dropdownOpen ? '1px solid var(--accent)' : undefined,
              boxShadow: dropdownOpen ? '0 0 0 3px var(--accent-dim)' : undefined,
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {(() => {
                const b = bateadorSel;
                if (!b) return 'Seleccionar bateador';
                const avgVal = activeAvgMap.get(b.id) ?? -1;
                const avgStr = avgVal >= 0 ? avgVal.toFixed(3).replace('0.', '.') : null;
                const equipo = b.equipo ? b.equipo.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()) : '';
                const inicial = b.nombre ? `, ${b.nombre.charAt(0).toUpperCase()}` : '';
                return (
                  <span>
                    {ordenarPorAvg && avgStr && (
                      <span style={{ color: valueColor(avgVal), fontWeight: 700, marginRight: 6 }}>{avgStr}</span>
                    )}
                    #{b.numero} {b.apellido}{inicial} - {equipo}
                  </span>
                );
              })()}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginLeft: 6, flexShrink: 0 }}>
              {dropdownOpen ? '▲' : '▼'}
            </span>
          </div>

          {/* Lista desplegable */}
          {dropdownOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 999,
              background: 'var(--bg-elevated)', border: '1px solid var(--accent)',
              borderRadius: 8, overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              maxHeight: 260, overflowY: 'auto',
            }}>
              {cargandoAvgAcumulado && modoAcumulado && ordenarPorAvg ? (
                <div style={{ padding: '14px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  Cargando AVG acumulado...
                </div>
              ) : (
                todosOrdenados.map((b, idx) => {
                  const avgVal = activeAvgMap.get(b.id) ?? -1;
                  const avgStr = avgVal >= 0 ? avgVal.toFixed(3).replace('0.', '.') : '---';
                  const equipo = b.equipo ? b.equipo.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()) : '';
                  const inicial = b.nombre ? `, ${b.nombre.charAt(0).toUpperCase()}` : '';
                  const isSelected = b.id === (selId ?? bateadorSel?.id);
                  const prevEquipo = idx > 0 ? todosOrdenados[idx - 1].equipo : null;
                  const showDivider = idx > 0 && b.equipo !== prevEquipo;
                  return (
                    <React.Fragment key={b.id}>
                      {showDivider && (
                        <div style={{ height: 1, background: 'var(--border)', margin: '0 8px' }} />
                      )}
                      <div
                        onClick={() => {
                          dispatch({ type: 'SELECCIONAR_JUGADOR', payload: b.id });
                          setDropdownOpen(false);
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '10px 14px',
                          cursor: 'pointer',
                          background: isSelected ? 'var(--accent-dim)' : 'transparent',
                          borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        {ordenarPorAvg && (
                          <span style={{
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            minWidth: 34,
                            color: avgVal >= 0 ? valueColor(avgVal) : 'var(--text-secondary)',
                            fontVariantNumeric: 'tabular-nums',
                          }}>
                            {avgStr}
                          </span>
                        )}
                        <span style={{ fontSize: '0.85rem', color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>
                          #{b.numero} {b.apellido}{inicial}
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}> — {equipo}</span>
                        </span>
                      </div>
                    </React.Fragment>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Toggle Acumulado */}
        <div style={{ display: 'flex', gap: 8, background: 'var(--bg-elevated)', padding: 4, borderRadius: 8 }}>
          <button
            className={`btn btn-sm ${!modoAcumulado ? 'btn-primary' : ''}`}
            style={{ flex: 1, background: !modoAcumulado ? '' : 'transparent', color: !modoAcumulado ? '' : 'var(--text-secondary)', opacity: !estado.partido?.finalizado ? 0.5 : 1 }}
            disabled={!estado.partido?.finalizado}
            onClick={() => setModoAcumulado(false)}
          >
            Este partido
          </button>
          <button
            className={`btn btn-sm ${modoAcumulado ? 'btn-primary' : ''}`}
            style={{ flex: 1, background: modoAcumulado ? '' : 'transparent', color: modoAcumulado ? '' : 'var(--text-secondary)', opacity: !estado.partido?.finalizado ? 0.5 : 1 }}
            disabled={!estado.partido?.finalizado}
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
              { label: 'KS/KL', value: stats.strikeoutsSwinging + stats.strikeoutsLooking, color: 'var(--info)' },
              { label: 'BB/HBP', value: stats.basesPorBolas, color: 'var(--text-secondary)' },
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
            zoneStats={zonasDir}
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
                    <th style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Pitcheos</th>
                    <th style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>AB</th>
                    <th style={{ textAlign: 'center' }}>Hits</th>
                    <th style={{ textAlign: 'center' }}>A/F</th>
                    <th style={{ textAlign: 'center' }}>K</th>
                    <th style={{ textAlign: 'center' }}>AVG</th>
                  </tr>
                </thead>
                <tbody>
                  {([1,2,3,4,5,6,7,8] as ZonaStrike[]).map((z) => {
                    const d = zonasDir[z];
                    const avgZonaVal = d.ab > 0 ? d.hits / d.ab : null;
                    const avgZona = avgZonaVal !== null ? avgZonaVal.toFixed(3).replace('0.', '.') : '---';
                    return (
                      <React.Fragment key={z}>
                      <tr>
                        <td>
                          <span>Zona {z}</span>
                        </td>
                        <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{d.pitches}</td>
                        <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{d.ab}</td>
                        <td style={{ textAlign: 'center', color: d.hits > 0 ? 'var(--danger)' : 'var(--text-secondary)' }}>
                          {d.hits}
                        </td>
                        <td style={{ textAlign: 'center', color: d.outs > 0 ? 'var(--success)' : 'var(--text-secondary)' }}>
                          {d.outs}
                        </td>
                        <td style={{ textAlign: 'center', color: (d.ks + d.kl) > 0 ? 'var(--info)' : 'var(--text-secondary)' }}>
                          {d.ks + d.kl}
                        </td>
                        <td style={{ textAlign: 'center', color: valueColor(avgZonaVal), fontWeight: avgZonaVal !== null ? 600 : 'normal' }}>
                          {avgZona}
                        </td>
                      </tr>
                      {z === 4 && (
                        <tr>
                          <td colSpan={7} style={{ padding: 0, height: 2, background: 'var(--text-muted)' }} />
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
            <p className="section-title" style={{ marginBottom: 8 }}>Tipo de pitch / K</p>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Pitch</th>
                    <th style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Vistos</th>
                    <th style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>AB</th>
                    <th style={{ textAlign: 'center' }}>K</th>
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
                      const ks = d.ks + d.kl;
                      return (
                        <tr key={p}>
                          <td style={{ textTransform: 'capitalize', fontWeight: 700 }}>{p}</td>
                          <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{d.pitches}</td>
                          <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{d.ab}</td>
                          <td style={{ textAlign: 'center', color: ks > 0 ? 'var(--info)' : 'var(--text-secondary)' }}>
                            {ks > 0 ? ks : '0'}
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
