'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import ZonaStrikeComponent from './ZonaStrike';
import { obtenerTurnosAcumulados, calcularEstadisticas, calcularHeatMap } from '@/lib/storage';
import type { TurnoAlBate } from '@/lib/types';

interface Props {
  apellido: string;
  numero: string;
  equipo: string;
  nombre?: string;
  ladoBateo?: 'D' | 'Z' | 'S';
  onClose: () => void;
}

export default function HeatMapModal({ apellido, numero, equipo, nombre, ladoBateo, onClose }: Props) {
  const [turnos, setTurnos] = useState<TurnoAlBate[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let activo = true;
    obtenerTurnosAcumulados(apellido, numero, equipo, nombre)
      .then((t) => { if (activo) setTurnos(t); })
      .catch((err) => {
        console.error('Error cargando heatmap acumulado:', err);
        if (activo) setError(true);
      });
    return () => { activo = false; };
  }, [apellido, numero, equipo]);

  // Trick: forzamos un bateadorId comun para que calcularEstadisticas sume
  // turnos que en realidad pertenecen a distintos partidos (distintos IDs de bateador).
  const stats = useMemo(() => {
    if (!turnos) return null;
    const turnosNormalizados = turnos.map((t) => ({ ...t, bateadorId: 'acumulado' }));
    return calcularEstadisticas('acumulado', turnosNormalizados);
  }, [turnos]);

  const heatMap = useMemo(() => {
    if (!turnos) return undefined;
    return calcularHeatMap(turnos);
  }, [turnos]);

  const contenidoRef = useRef<HTMLDivElement>(null);

  const cargando = turnos === null && !error;
  const avg = stats && stats.turnosAlBate > 0 ? stats.promedio.toFixed(3).replace('0.', '.') : '.000';

  const nombreArchivo = () => {
    const inicial = nombre ? nombre.charAt(0).toUpperCase() : '';
    const fecha = new Date().toLocaleDateString('es-AR').split('/').join('-');
    return `${apellido}-${inicial}_${equipo}_${fecha}.png`;
  };

  const compartirODescargar = async () => {
    if (!contenidoRef.current) return;
    try {
      const dataUrl = await toPng(contenidoRef.current, { backgroundColor: '#161A22', pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const archivo = new File([blob], nombreArchivo(), { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
        await navigator.share({ files: [archivo] });
      } else {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = nombreArchivo();
        link.click();
      }
    } catch (err) {
      console.error('Error al exportar heatmap:', err);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 16,
      }}
    >
      {/* Contenedor externo: no capturado */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 12, maxWidth: 420, width: '100%',
          maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* HEADER — fuera del ref, no aparece en la imagen exportada */}
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '16px', display: 'flex', alignItems: 'center', zIndex: 10 }}>
          <button
            onClick={compartirODescargar}
            className="btn btn-primary btn-sm"
            style={{ marginRight: 16, lineHeight: 1 }}
          >
            Exportar
          </button>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.3rem', cursor: 'pointer', lineHeight: 1 }}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* CONTENIDO EXPORTABLE — capturado por contenidoRef */}
        <div ref={contenidoRef} style={{ padding: '16px', background: 'var(--bg-surface)' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', marginBottom: 4, paddingRight: 90 }}>
            {apellido}{nombre ? `, ${nombre}` : ''} — <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{equipo}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Acumulado
          </div>

          {cargando && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-secondary)' }}>
              Cargando…
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--danger)' }}>
              No se pudo cargar el historial de este jugador.
            </div>
          )}

          {!cargando && !error && stats && (
            <>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', fontWeight: 700 }}>AB</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{stats.turnosAlBate}</div>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--danger)', fontWeight: 700 }}>H</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--danger)' }}>{stats.hits}</div>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--success)', fontWeight: 700 }}>O</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--success)' }}>{stats.outs}</div>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--info)', fontWeight: 700 }}>K</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--info)' }}>{stats.strikeoutsSwinging + stats.strikeoutsLooking}</div>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.62rem', color: '#8892A4', fontWeight: 700 }}>BB/HBP</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#8892A4' }}>{stats.basesPorBolas}</div>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0, marginLeft: 'auto' }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--accent)', fontWeight: 700 }}>AVG</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent)' }}>{avg}</div>
                </div>
              </div>

              <ZonaStrikeComponent
                onZonaClick={() => {}}
                heatMap={heatMap}
                ladoBateo={ladoBateo}
                zoneStats={stats.porZona}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

