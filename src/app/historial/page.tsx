'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useScout } from '@/context/ScoutContext';
import { useLanguage } from '@/context/LanguageContext';
import ModalConfirm from '@/components/ModalConfirm';
import type { Partido } from '@/lib/types';
import { db, getEstadoPartido } from '@/lib/dbClient';

export default function HistorialPage() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoId, setCargandoId] = useState<string | null>(null);
  const [confirmandoEliminar, setConfirmandoEliminar] = useState<string | null>(null);
  const [confirmandoContinuar, setConfirmandoContinuar] = useState<string | null>(null);
  const router = useRouter();
  const { dispatch } = useScout();
  const { t, locale } = useLanguage();

  useEffect(() => {
    db.partidos.toArray()
      .then(async list => {
        const sorted = list
          .filter(p => p.finalizado === true || (p as any).finalizado === 1)
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
          
        for (const p of sorted) {
          const turnos = await db.turnos_al_bate.where('partidoId').equals(p.id).toArray();
          if (turnos.length > 0) {
            const maxInning = Math.max(...turnos.map(t => t.inning));
            if (maxInning !== p.innings) {
              p.innings = maxInning;
            }
          } else if (p.innings === 7) {
            p.innings = 0;
          }
        }
        
        setPartidos(sorted);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  const cargarPartido = async (id: string) => {
    setCargandoId(id);
    try {
      const estado = await getEstadoPartido(id);
      if (estado && estado.partido) {
        estado.partido.finalizado = true;
        dispatch({ type: 'CARGAR_ESTADO', payload: estado });
        router.push(`/stats?verPartido=${id}`);
      }
    } catch (err) {
      console.error('Error cargando partido:', err);
    }
    setCargandoId(null);
  };

  // Load partida and navigate to lineup (read‑only)
  const cargarPartidoLineup = async (id: string) => {
    setCargandoId(id);
    try {
      const estado = await getEstadoPartido(id);
      if (estado && estado.partido) {
        estado.partido.finalizado = true;
        dispatch({ type: 'CARGAR_ESTADO', payload: estado });
        router.push(`/?verPartido=${id}`);
      }
    } catch (err) {
      console.error('Error cargando partido:', err);
    }
    setCargandoId(null);
  };

  // ─── PASO 2: Reabrir un partido finalizado para continuar el tracking ──────
  const reabrirPartido = async (id: string) => {
    setCargandoId(id);
    try {
      // 1. Buscar todos los partidos activos (excluyendo el que se va a reabrir)
      const activos = await db.partidos.filter(p => !p.finalizado).toArray();
      const otrosActivos = activos.filter(p => p.id !== id);

      // 2. Finalizar los otros partidos activos para garantizar unicidad
      for (const p of otrosActivos) {
        await db.partidos.update(p.id, { finalizado: true });
      }

      // 3. Marcar el partido objetivo como activo nuevamente
      await db.partidos.update(id, { finalizado: false });

      // 4. Reconstruir el estado completo desde Dexie (partido + bateadores + turnos)
      const estado = await getEstadoPartido(id);

      if (estado && estado.partido) {
        // 5. Asegurar que el estado tenga finalizado: false explícito
        estado.partido.finalizado = false;

        // 6. Hidratar ScoutContext en memoria con el partido reabierto
        dispatch({ type: 'CARGAR_ESTADO', payload: estado });

        // 7. Navegar a tracking (no a stats)
        router.push('/tracking');
      }
    } catch (err) {
      console.error('Error reabriendo partido:', err);
    }
    setCargandoId(null);
  };

  const pedirEliminar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConfirmandoEliminar(id);
  };

  const confirmarEliminar = async () => {
    if (!confirmandoEliminar) return;
    try {
      await db.partidos.delete(confirmandoEliminar);
      await db.bateadores.where('partidoId').equals(confirmandoEliminar).delete();
      await db.turnos_al_bate.where('partidoId').equals(confirmandoEliminar).delete();
      setPartidos(prev => prev.filter(p => p.id !== confirmandoEliminar));
    } catch (err) {
      console.error('Error eliminando partido:', err);
    }
    setConfirmandoEliminar(null);
  };

  if (cargando) {
    return <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-secondary)' }}>{t('historial.loading')}</div>;
  }

  if (partidos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">{t('historial.empty_title')}</div>
        <p className="empty-state__text">{t('historial.empty_text')}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, paddingBottom: 32 }}>
      <p className="section-title" style={{ marginBottom: 12 }}>{t('historial.archived_matches')}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {partidos.map(p => (
          <div
            key={p.id}
            className="card"
            onClick={() => cargarPartido(p.id)}
            style={{
              padding: '12px 156px 12px 16px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              borderColor: cargandoId === p.id ? 'var(--accent)' : undefined,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(245,166,35,0.15)'; }}
            onMouseLeave={(e) => { if (cargandoId !== p.id) { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; } }}
          >
            <p className="text-xs text-secondary" style={{ marginBottom: 4 }}>
              {new Date(p.fecha + 'T12:00:00').toLocaleDateString(locale === 'en' ? 'en-US' : 'es-AR')} · {p.innings} inning{p.innings !== 1 ? 's' : ''}
            </p>
            <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 2 }}>
              {p.visitante} vs {p.local}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {p.descripcion}
            </p>
            {cargandoId === p.id && (
              <span style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.75rem', color: 'var(--accent)' }}>
                {t('historial.loading_badge')}
              </span>
            )}

            {/* ─── Botones de acción (columna derecha) ─── */}
            {cargandoId !== p.id && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: 12,
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Botón "Continuar partido" — PASO 4 */}
                <button
                  title={t('historial.continue')}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmandoContinuar(p.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    opacity: 0.85,
                    lineHeight: 1,
                    padding: '2px 4px',
                  }}
                >
                  ▶
                </button>

                {/* Botón "Eliminar partido" */}
                <button
                  title={t('historial.delete')}
                  onClick={(e) => {
                    e.stopPropagation();
                    pedirEliminar(e, p.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    opacity: 0.7,
                    lineHeight: 1,
                    padding: '2px 4px',
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Botón "Ver estadísticas" — PASO 1: label actualizado */}
            {cargandoId !== p.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cargarPartidoLineup(p.id);
                }}
                className="btn btn-primary"
                style={{
                  position: 'absolute', top: '50%', right: 44, transform: 'translateY(-50%)',
                  padding: '8px 12px', fontSize: '0.8rem', lineHeight: 1.2, textAlign: 'center'
                }}
              >
                {t('historial.view_stats_line1')}<br/>{t('historial.view_stats_line2')}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal: Eliminar partido */}
      {confirmandoEliminar && (
        <ModalConfirm
          mensaje={t('modal_confirm.delete_match')}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setConfirmandoEliminar(null)}
        />
      )}

      {/* Modal: Continuar partido — PASO 3A */}
      {confirmandoContinuar && (
        <ModalConfirm
          mensaje={t('modal_confirm.continue_match')}
          onConfirmar={() => {
            const id = confirmandoContinuar;
            setConfirmandoContinuar(null);
            reabrirPartido(id);
          }}
          onCancelar={() => setConfirmandoContinuar(null)}
        />
      )}
    </div>
  );
}
