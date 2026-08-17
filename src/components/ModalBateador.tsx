import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalConfirm from './ModalConfirm';
import { useLanguage } from '@/context/LanguageContext';

export interface FormBateador {
  numero: string;
  apellido: string;
  nombre: string;
  equipo: string;
  ladoBateo: 'D' | 'Z' | 'S';
}

export const FORM_VACIO: FormBateador = { numero: '', apellido: '', nombre: '', equipo: '', ladoBateo: 'D' };

export default function ModalBateador({
  inicial,
  titulo,
  subtitulo,
  equipo,
  onGuardar,
  onClose,
}: {
  inicial?: FormBateador;
  titulo: string;
  subtitulo?: string;
  equipo?: string;
  onGuardar: (d: FormBateador) => void;
  onClose: () => void;
}) {
  const { t, tv } = useLanguage();
  const [form, setForm] = useState<FormBateador>(inicial ?? FORM_VACIO);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  
  const set = (k: keyof FormBateador) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const guardar = () => {
    if (!form.apellido.trim() || !form.numero.trim() || !form.nombre.trim()) {
      setMostrarAlerta(true);
      return;
    }
    onGuardar({
      numero: form.numero.trim(),
      apellido: form.apellido.trim().toUpperCase(),
      nombre: form.nombre.trim().toUpperCase(),
      equipo: form.equipo.trim().toUpperCase(),
      ladoBateo: form.ladoBateo,
    });
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '4px',
            lineHeight: 1,
            zIndex: 10
          }}
          aria-label={t('modal_bateador.close')}
        >
          ✕
        </button>
        <div className="sheet-handle" />
        {equipo && <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textAlign: 'center', letterSpacing: '0.08em', marginBottom: 4 }}>{equipo.toUpperCase()}</p>}
        <h2 className="sheet-title">{titulo}</h2>
        {subtitulo && <p className="sheet-subtitle">{subtitulo}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="form-group" style={{ width: '40%' }}>
            <label className="label">{t('modal_bateador.jersey')}</label>
            <input className="input" placeholder="7" value={form.numero} onChange={set('numero')} maxLength={3} inputMode="numeric" />
          </div>
          <div className="form-group">
            <label className="label">{t('modal_bateador.last_name')}</label>
            <input className="input" placeholder="HORT" value={form.apellido} onChange={set('apellido')} maxLength={40} autoCapitalize="characters" />
          </div>
          <div className="form-group">
            <label className="label">{t('modal_bateador.first_name')}</label>
            <input className="input" placeholder="LOCHLAN" value={form.nombre} onChange={set('nombre')} maxLength={40} autoCapitalize="characters" />
          </div>
          <div className="form-group">
            <label className="label">{t('modal_bateador.batting_side')}</label>
            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              {(['D', 'Z', 'S'] as const).map(l => (
                <button
                  key={l}
                  className={`btn ${form.ladoBateo === l ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ flex: 1, borderRadius: 0, border: 'none', borderRight: l !== 'S' ? '1px solid var(--border)' : 'none', padding: '10px 0' }}
                  onClick={() => setForm({ ...form, ladoBateo: l })}
                >
                  {tv(l)}
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary btn-full" onClick={guardar}>{t('modal_bateador.save')}</button>
        </div>
      </div>
      
      {mostrarAlerta && createPortal(
        <ModalConfirm
          mensaje={t('modal_bateador.validation')}
          onConfirmar={() => setMostrarAlerta(false)}
          onCancelar={() => setMostrarAlerta(false)}
          soloAviso={true}
        />,
        document.body
      )}
    </div>
  );
}
