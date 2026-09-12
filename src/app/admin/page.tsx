'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ModalConfirm from '@/components/ModalConfirm';
import { GRACE_PERIOD_MS } from '@/lib/licenseConstants';

const ADMIN_PASSWORD = 'MS@Admin#CJL@2026';

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
  plan: 'full' | 'promo';
};

type Activation = {
  id: string;
  license_code: string;
  device_fingerprint: string;
  device_info: string;
  activated_at: string;
  last_verified_at: string;
};

type TabCategory = 'Activas' | 'Vencidas' | 'Sin activar' | 'Revocadas' | 'Administrador';

const getCategory = (lic: License): TabCategory => {
  if (lic.code === 'MISCOUT-DEV-LACOUT-2026') return 'Administrador';
  if (lic.status === 'revoked') return 'Revocadas';
  if (lic.activations_used === 0) return 'Sin activar';
  if (lic.expires_at && new Date(lic.expires_at) < new Date()) return 'Vencidas';
  return 'Activas';
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [licenses, setLicenses] = useState<License[]>([]);
  const [activations, setActivations] = useState<Activation[]>([]);
  const [newCode, setNewCode] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newPlan, setNewPlan] = useState<'full' | 'promo'>('full');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<TabCategory>('Activas');
  const [confirmandoLiberacion, setConfirmandoLiberacion] = useState<{activationId: string, licenseCode: string} | null>(null);
  const [confirmandoRevocacion, setConfirmandoRevocacion] = useState<string | null>(null);
  const [confirmandoEliminacion, setConfirmandoEliminacion] = useState<{activationId: string, licenseCode: string} | null>(null);
  // Per-license toggle: key = license code, value = whether to show inactive activations
  const [showInactiveMap, setShowInactiveMap] = useState<Record<string, boolean>>({});

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


    const { error } = await supabase
      .from('licenses')
      .insert({ 
        code, 
        version: 'v1.3', 
        notes: newNotes,
        expires_at: null,
        plan: newPlan,
        release_count: newPlan === 'promo' ? 1 : 0,
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

    // Fetch fresh license data from Supabase to avoid stale React state
    const { data: freshLicense } = await supabase
      .from('licenses')
      .select('activations_used, release_count')
      .eq('code', licenseCode)
      .single();

    if (!freshLicense || freshLicense.release_count >= 1) {
      alert('Esta licencia ya usó su único permiso de liberación. No se pueden liberar más activaciones.');
      setConfirmandoLiberacion(null);
      return;
    }

    // Decrement activations_used and increment release_count conditionally (WHERE release_count < 1)
    const { data: updatedLicense } = await supabase
      .from('licenses')
      .update({
        activations_used: Math.max(0, freshLicense.activations_used - 1),
        release_count: freshLicense.release_count + 1,
      })
      .eq('code', licenseCode)
      .lt('release_count', 1)
      .select();

    if (!updatedLicense || updatedLicense.length === 0) {
      alert('Esta licencia ya usó su único permiso de liberación. No se pueden liberar más activaciones.');
      setConfirmandoLiberacion(null);
      return;
    }

    // Delete the activation only after confirming license release update succeeded
    const { error: deleteError } = await supabase
      .from('activations')
      .delete()
      .eq('id', activationId);

    if (deleteError) {
      console.error(`release_count and activations_used were updated for license ${licenseCode}, but activation row ${activationId} could not be deleted: ${deleteError.message}`);
    }

    setConfirmandoLiberacion(null);
    loadData();
  };

  const handleDeleteActivation = (activationId: string, licenseCode: string) => {
    setConfirmandoEliminacion({ activationId, licenseCode });
  };

  const ejecutarEliminacion = async () => {
    if (!confirmandoEliminacion) return;
    const { activationId, licenseCode } = confirmandoEliminacion;

    // Delete the activation row
    await supabase
      .from('activations')
      .delete()
      .eq('id', activationId);

    // Re-fetch the fresh activations_used value from Supabase (Approach B)
    // to avoid decrementing from stale local React state.
    const { data: freshLicense } = await supabase
      .from('licenses')
      .select('activations_used')
      .eq('code', licenseCode)
      .single();

    if (freshLicense) {
      // Decrement activations_used ONLY — do NOT touch release_count
      await supabase
        .from('licenses')
        .update({
          activations_used: Math.max(0, freshLicense.activations_used - 1),
        })
        .eq('code', licenseCode);
    }

    setConfirmandoEliminacion(null);
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
          <select
            value={newPlan}
            onChange={(e) => setNewPlan(e.target.value as 'full' | 'promo')}
            style={{
              padding: '0.75rem', borderRadius: '8px',
              border: '1px solid var(--border)', background: 'var(--bg-base)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="full">Pack Profesional — USD 96 · 1 año</option>
            <option value="promo">Pack Lanzamiento — Gratis · 1 mes</option>
          </select>
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

      {/* Pestañas de licencias */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {(['Activas', 'Vencidas', 'Sin activar', 'Revocadas', 'Administrador'] as TabCategory[]).map(tab => {
          const count = licenses.filter(l => getCategory(l) === tab).length;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.75rem 1rem',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                borderBottom: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                fontSize: '0.9rem',
              }}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Lista de licencias filtradas */}
      {licenses.filter(lic => getCategory(lic) === activeTab).map((lic) => {
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
                  Plan: {lic.plan === 'promo' ? '🟡 Lanzamiento' : '🟢 Profesional'} · 
                  Activaciones: {lic.activations_used}/{lic.max_activations} · 
                  Liberaciones usadas: {lic.release_count}/1 · 
                  Vence: {lic.expires_at ? new Date(lic.expires_at).toLocaleDateString('es-AR') : lic.activations_used === 0 ? 'Sin activar aún' : 'Sin vencimiento'} · 
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
            {acts.length > 0 && (() => {
              const inactiveCount = acts.filter(a =>
                Date.now() - new Date(a.last_verified_at).getTime() > GRACE_PERIOD_MS
              ).length;
              const showInactive = !!showInactiveMap[lic.code];
              const visibleActs = acts.filter(a => {
                const inactive = Date.now() - new Date(a.last_verified_at).getTime() > GRACE_PERIOD_MS;
                return !inactive || showInactive;
              });
              return (
                <div style={{ marginTop: '0.75rem' }}>
                  {/* Toggle — only rendered when there are inactive activations */}
                  {inactiveCount > 0 && (
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      fontSize: '0.72rem', color: 'var(--text-secondary)',
                      cursor: 'pointer', marginBottom: '0.4rem', userSelect: 'none',
                    }}>
                      <input
                        type="checkbox"
                        checked={showInactive}
                        onChange={() => setShowInactiveMap(prev => ({
                          ...prev,
                          [lic.code]: !prev[lic.code],
                        }))}
                        style={{ cursor: 'pointer' }}
                      />
                      Mostrar inactivas ({inactiveCount})
                    </label>
                  )}
                  {visibleActs.map((act) => {
                    const info = act.device_info ? JSON.parse(act.device_info) : null;
                    const isInactive = Date.now() - new Date(act.last_verified_at).getTime() > GRACE_PERIOD_MS;
                    return (
                      <div key={act.id} style={{
                        background: 'var(--bg-base)', borderRadius: '8px',
                        padding: '0.75rem', marginTop: '0.5rem',
                        fontSize: '0.75rem', color: 'var(--text-secondary)',
                        opacity: isInactive ? 0.5 : 1,
                      }}>
                        <p>📱 {info?.userAgent || 'Desconocido'}</p>
                        <p>🌍 {info?.timezone || '-'} · {info?.screen || '-'}</p>
                        <p>🔑 FP: {act.device_fingerprint.substring(0, 16)}...</p>
                        <p>📅 Activado: {new Date(act.activated_at).toLocaleString('es-AR')}</p>
                        <p>✅ Última verificación: {new Date(act.last_verified_at).toLocaleString('es-AR')}{' '}
                          {isInactive && (
                            <span style={{
                              display: 'inline-block',
                              background: '#6b7280',
                              color: '#fff',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              letterSpacing: '0.05em',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                              verticalAlign: 'middle',
                              marginLeft: '0.35rem',
                            }}>Inactiva</span>
                          )}
                        </p>
                        {/* Action buttons for this activation */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                          {/* Only show Liberar if release_count < 1 */}
                          {lic.release_count < 1 && (
                            <button
                              onClick={() => handleReleaseActivation(act.id, lic.code)}
                              style={{
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
                          {/* Hard delete — always visible, does NOT consume release_count */}
                          <button
                            onClick={() => handleDeleteActivation(act.id, lic.code)}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.35rem 0.75rem',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                            }}
                          >
                            Eliminar activación
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
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

      {confirmandoEliminacion && (
        <ModalConfirm
          mensaje="ATENCIÓN: Esto eliminará permanentemente esta activación (hard delete). NO consumirá una liberación (release_count queda intacto). ¿Confirmar eliminación? Esta acción no se puede deshacer."
          onConfirmar={ejecutarEliminacion}
          onCancelar={() => setConfirmandoEliminacion(null)}
        />
      )}
    </div>
  );
}
