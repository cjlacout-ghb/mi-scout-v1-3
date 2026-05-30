'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useScout } from '@/context/ScoutContext';
import ModalConfirm from '@/components/ModalConfirm';
import type { Partido } from '@/lib/types';

export default function HistorialPage() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoId, setCargandoId] = useState<string | null>(null);
  const [confirmandoEliminar, setConfirmandoEliminar] = useState<string | null>(null);
  const router = useRouter();
  const { dispatch } = useScout();

  useEffect(() => {
    fetch('/api/partidos')
      .then(res => res.json())
      .then(data => {
        if (data.partidos) setPartidos(data.partidos);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  const cargarPartido = async (id: string) => {
    setCargandoId(id);
    try {
      const res = await fetch(`/api/partido?id=${id}`);
      const data = await res.json();
      if (data.estado && data.estado.partido) {
        data.estado.partido.finalizado = true;
        dispatch({ type: 'CARGAR_ESTADO', payload: data.estado });
        router.push('/stats');
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
    await fetch(`/api/partido?id=${confirmandoEliminar}`, { method: 'DELETE' });
    setPartidos(prev => prev.filter(p => p.id !== confirmandoEliminar));
    setConfirmandoEliminar(null);
  };

  if (cargando) {
    return <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando historial...</div>;
  }

  if (partidos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">📚</div>
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
              {new Date(p.fecha).toLocaleDateString('es-AR')} · {p.innings} innings
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
                onClick={(e) => pedirEliminar(e, p.id)}
                style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'none', border: 'none', color: 'var(--danger)',
                  cursor: 'pointer', fontSize: '1.2rem', opacity: 0.7
                }}
              >
                ✕
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
