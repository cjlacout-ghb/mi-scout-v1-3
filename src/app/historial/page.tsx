'use client';

import { useState, useEffect } from 'react';
import type { Partido } from '@/lib/types';

export default function HistorialPage() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('/api/partidos')
      .then(res => res.json())
      .then(data => {
        if (data.partidos) setPartidos(data.partidos);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  const eliminarPartido = async (id: string) => {
    if (!confirm('¿Seguro que querés eliminar este partido y todos sus datos?')) return;
    await fetch(`/api/partido?id=${id}`, { method: 'DELETE' });
    setPartidos(prev => prev.filter(p => p.id !== id));
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
          <div key={p.id} className="card" style={{ padding: '12px 16px', position: 'relative' }}>
            <p className="text-xs text-secondary" style={{ marginBottom: 4 }}>
              {new Date(p.fecha).toLocaleDateString('es-AR')} · {p.innings} innings
            </p>
            <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 2 }}>
              {p.visitante} vs {p.local}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {p.descripcion}
            </p>
            
            <button
              onClick={() => eliminarPartido(p.id)}
              style={{
                position: 'absolute', top: 12, right: 12,
                background: 'none', border: 'none', color: 'var(--danger)',
                cursor: 'pointer', fontSize: '1.2rem', opacity: 0.7
              }}
              title="Eliminar partido"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
