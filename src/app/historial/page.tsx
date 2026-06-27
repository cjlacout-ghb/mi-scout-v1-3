'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useScout } from '@/context/ScoutContext';
import ModalConfirm from '@/components/ModalConfirm';
import type { Partido } from '@/lib/types';
import { db, getEstadoPartido } from '@/lib/dbClient';

export default function HistorialPage() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoId, setCargandoId] = useState<string | null>(null);
  const [confirmandoEliminar, setConfirmandoEliminar] = useState<string | null>(null);
  const router = useRouter();
  const { dispatch } = useScout();

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
              await db.partidos.update(p.id, { innings: maxInning });
            }
          } else if (p.innings === 7) {
            p.innings = 0;
            await db.partidos.update(p.id, { innings: 0 });
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
        router.push('/stats');
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
        router.push('/');
      }
    } catch (err) {
      console.error('Error cargando partido:', err);
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
    return <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando historial...</div>;
  }

  if (partidos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">Historial vacío</div>
        <p className="empty-state__text">Cuando finalices un partido, aparecerá guardado aquí para consultas futuras.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, paddingBottom: 32 }}>
      <p className="section-title" style={{ marginBottom: 12 }}>Partidos archivados</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {partidos.map(p => (
          <div
            key={p.id}
            className="card"
            onClick={() => cargarPartido(p.id)}
            style={{
              padding: '12px 16px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              borderColor: cargandoId === p.id ? 'var(--accent)' : undefined,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(245,166,35,0.15)'; }}
            onMouseLeave={(e) => { if (cargandoId !== p.id) { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; } }}
          >
            <p className="text-xs text-secondary" style={{ marginBottom: 4 }}>
              {new Date(p.fecha + 'T12:00:00').toLocaleDateString('es-AR')} · {p.innings} inning{p.innings !== 1 ? 's' : ''}
            </p>
            <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 2 }}>
              {p.visitante} vs {p.local}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {p.descripcion}
            </p>
            {cargandoId === p.id && (
              <span style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.75rem', color: 'var(--accent)' }}>
                Cargando...
              </span>
            )}
                        {cargandoId !== p.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  pedirEliminar(e, p.id);
                }}
                style={{
                  position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--danger)',
                  cursor: 'pointer', fontSize: '1.2rem', opacity: 0.7
                }}
              >
                ✕
              </button>
            )}
            {cargandoId !== p.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cargarPartidoLineup(p.id);
                }}
                className="btn btn-primary"
                style={{
                  position: 'absolute', top: '50%', right: 44, transform: 'translateY(-50%)',
                  padding: '6px 10px', fontSize: '0.75rem', lineHeight: 1.2, textAlign: 'center'
                }}
              >
                Seleccionar<br/>jugador
              </button>
            )}
          </div>
        ))}
      </div>
      {confirmandoEliminar && (
        <ModalConfirm
          mensaje="¿Seguro que querés eliminar este partido y todos sus datos? Esta acción no se puede deshacer."
          onConfirmar={confirmarEliminar}
          onCancelar={() => setConfirmandoEliminar(null)}
        />
      )}
    </div>
  );
}
