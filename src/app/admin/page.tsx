'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ModalConfirm from '@/components/ModalConfirm';

const ADMIN_PASSWORD = 'MISCOUT-DEV-LACOUT-2026';

type License = {
  code: string;
  version: string;
  max_activations: number;
  activations_used: number;
  release_count: number;
  status: string;
  created_at: string;
  expires_at: string;
  notes: string;
};

type Activation = {
  id: string;
  license_code: string;
  device_fingerprint: string;
  device_info: string;
  activated_at: string;
  last_verified_at: string;
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [licenses, setLicenses] = useState<License[]>([]);
  const [activations, setActivations] = useState<Activation[]>([]);
  const [newCode, setNewCode] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmandoLiberacion, setConfirmandoLiberacion] = useState<{activationId: string, licenseCode: string} | null>(null);
  const [confirmandoRevocacion, setConfirmandoRevocacion] = useState<string | null>(null);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Contraseña incorrecta.');
    }
  };

  const loadData = async () => {
    const { data: lic } = await supabase
      .from('licenses')
      .select('*')
      .order('created_at', { ascending: false });
    const { data: act } = await supabase
      .from('activations')
      .select('*')
      .order('activated_at', { ascending: false });
    if (lic) setLicenses(lic);
    if (act) setActivations(act);
  };

  useEffect(() => {
    if (authenticated) loadData();
  }, [authenticated]);

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const part = (n: number) =>
      Array.from({ length: n }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join('');
    return `MISCOUT-v13-${part(4)}-${part(4)}`;
  };

  const handleCreateLicense = async () => {
    setLoading(true);
    setMessage('');
    const code = (newCode.trim() || generateCode()).toUpperCase();

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const { error } = await supabase
      .from('licenses')
      .insert({ 
        code, 
        version: 'v1.3', 
        notes: newNotes,
        expires_at: expiresAt.toISOString(),
      });
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage(`Licencia creada: ${code}`);
      setNewCode('');
      setNewNotes('');
      loadData();
    }
    setLoading(false);
  };

  const handleRevoke = (code: string) => {
    setConfirmandoRevocacion(code);
  };

  const ejecutarRevocacion = async () => {
    if (!confirmandoRevocacion) return;
    await supabase
      .from('licenses')
      .update({ status: 'revoked' })
      .eq('code', confirmandoRevocacion);
    setConfirmandoRevocacion(null);
    loadData();
  };

  const handleReleaseActivation = (activationId: string, licenseCode: string) => {
    // Find the license to check release_count
    const license = licenses.find((l) => l.code === licenseCode);
    if (!license) return;

    if ((license as any).release_count >= 1) {
      alert('Esta licencia ya usó su único permiso de liberación. No se pueden liberar más activaciones.');
      return;
    }

    setConfirmandoLiberacion({ activationId, licenseCode });
  };

  const ejecutarLiberacion = async () => {
    if (!confirmandoLiberacion) return;
    const { activationId, licenseCode } = confirmandoLiberacion;
    const license = licenses.find((l) => l.code === licenseCode);
    if (!license) {
      setConfirmandoLiberacion(null);
      return;
    }

    // Delete the activation
    await supabase
      .from('activations')
      .delete()
      .eq('id', activationId);

    // Decrement activations_used and increment release_count
    await supabase
      .from('licenses')
      .update({
        activations_used: license.activations_used - 1,
        release_count: (license as any).release_count + 1,
      })
      .eq('code', licenseCode);

    setConfirmandoLiberacion(null);
    loadData();
  };

  const getActivationsForLicense = (code: string) =>
    activations.filter((a) => a.license_code === code);

  if (!authenticated) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-base)', gap: '1rem', padding: '2rem',
      }}>
        <h1 style={{ color: 'var(--accent)', fontWeight: 800 }}>Admin Panel</h1>
        <input
          type="password"
          placeholder="Contraseña de administrador"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          style={{
            padding: '0.75rem 1rem', borderRadius: '8px',
            border: '1px solid var(--border)', background: 'var(--bg-elevated)',
            color: 'var(--text-primary)', fontSize: '1rem', width: '100%',
            maxWidth: '360px',
          }}
        />
        {authError && <p style={{ color: '#ef4444' }}>{authError}</p>}
        <button onClick={handleLogin} className="btn btn-primary">
          Ingresar
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--bg-base)',
      padding: '1.5rem', color: 'var(--text-primary)',
    }}>
      <h1 style={{ color: 'var(--accent)', fontWeight: 800, marginBottom: '1.5rem' }}>
        MiScout Admin — Licencias
      </h1>

      {/* Crear nueva licencia */}
      <div style={{
        background: 'var(--bg-elevated)', borderRadius: '12px',
        padding: '1.5rem', marginBottom: '2rem',
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Crear nueva licencia</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Código (dejar vacío para generar automáticamente)"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value.toUpperCase())}
            style={{
              padding: '0.75rem', borderRadius: '8px',
              border: '1px solid var(--border)', background: 'var(--bg-base)',
              color: 'var(--text-primary)',
            }}
          />
          <input
            type="text"
            placeholder="Notas (nombre del cliente, equipo, etc.)"
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            style={{
              padding: '0.75rem', borderRadius: '8px',
              border: '1px solid var(--border)', background: 'var(--bg-base)',
              color: 'var(--text-primary)',
            }}
          />
          <button
            onClick={handleCreateLicense}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Creando...' : 'Crear licencia'}
          </button>
          {message && (
            <p style={{ color: 'var(--accent)', fontWeight: 600 }}>{message}</p>
          )}
        </div>
      </div>

      {/* Lista de licencias */}
      <h2 style={{ marginBottom: '1rem' }}>Licencias activas</h2>
      {licenses.map((lic) => {
        const acts = getActivationsForLicense(lic.code);
        return (
          <div key={lic.code} style={{
            background: 'var(--bg-elevated)', borderRadius: '12px',
            padding: '1.25rem', marginBottom: '1rem',
            borderLeft: `4px solid ${lic.status === 'active' ? 'var(--accent)' : '#ef4444'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '1rem' }}>{lic.code}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  {lic.notes || 'Sin notas'} · {lic.version} · 
                  Activaciones: {lic.activations_used}/{lic.max_activations} · 
                  Liberaciones usadas: {lic.release_count}/1 · 
                  Vence: {lic.expires_at ? new Date(lic.expires_at).toLocaleDateString('es-AR') : 'Sin vencimiento'} · 
                  Estado: {lic.status}
                </p>
              </div>
              {lic.status === 'active' && lic.code !== 'MISCOUT-DEV-LACOUT-2026' && (
                <button
                  onClick={() => handleRevoke(lic.code)}
                  style={{
                    background: '#ef4444', color: 'white', border: 'none',
                    borderRadius: '6px', padding: '0.4rem 0.8rem',
                    cursor: 'pointer', fontSize: '0.8rem',
                  }}
                >
                  Revocar
                </button>
              )}
            </div>

            {/* Activaciones de esta licencia */}
            {acts.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                {acts.map((act) => {
                  const info = act.device_info ? JSON.parse(act.device_info) : null;
                  return (
                    <div key={act.id} style={{
                      background: 'var(--bg-base)', borderRadius: '8px',
                      padding: '0.75rem', marginTop: '0.5rem',
                      fontSize: '0.75rem', color: 'var(--text-secondary)',
                    }}>
                      <p>📱 {info?.userAgent || 'Desconocido'}</p>
                      <p>🌍 {info?.timezone || '-'} · {info?.screen || '-'}</p>
                      <p>🔑 FP: {act.device_fingerprint.substring(0, 16)}...</p>
                      <p>📅 Activado: {new Date(act.activated_at).toLocaleString('es-AR')}</p>
                      <p>✅ Última verificación: {new Date(act.last_verified_at).toLocaleString('es-AR')}</p>
                      {/* Only show Liberar if release_count < 1 */}
                      {lic.release_count < 1 && (
                        <button
                          onClick={() => handleReleaseActivation(act.id, lic.code)}
                          style={{
                            marginTop: '0.5rem',
                            background: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.35rem 0.75rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          Liberar activación
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {confirmandoLiberacion && (
        <ModalConfirm
          mensaje="ATENCIÓN: Solo se permite liberar 1 activación por licencia. ¿Confirmar liberación de esta activación? Esta acción no se puede deshacer."
          onConfirmar={ejecutarLiberacion}
          onCancelar={() => setConfirmandoLiberacion(null)}
        />
      )}

      {confirmandoRevocacion && (
        <ModalConfirm
          mensaje={`¿Estás seguro de que deseas revocar la licencia ${confirmandoRevocacion}? Esta acción no se puede deshacer.`}
          onConfirmar={ejecutarRevocacion}
          onCancelar={() => setConfirmandoRevocacion(null)}
        />
      )}
    </div>
  );
}
