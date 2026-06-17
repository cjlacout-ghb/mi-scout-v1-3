'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDeviceFingerprint, getDeviceInfo } from '@/lib/deviceFingerprint';

export default function ActivatePage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleActivate = async () => {
    if (!code.trim()) {
      setError('Por favor ingresá tu código de licencia.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const deviceFingerprint = await getDeviceFingerprint();
      const deviceInfo = getDeviceInfo();

      const res = await fetch('/api/license/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          deviceFingerprint,
          deviceInfo,
        }),
      });

      const data = await res.json();

      if (data.valid) {
        // Save activation locally in IndexedDB
        localStorage.setItem('miscout_license', code.trim().toUpperCase());
        localStorage.setItem('miscout_device_fp', deviceFingerprint);
        router.push('/');
      } else {
        setError(data.error || 'Código inválido. Verificá e intentá de nuevo.');
      }
    } catch {
      setError('Error de conexión. Verificá tu internet e intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'var(--bg-base)',
      gap: '1.5rem',
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>
          Mi<span style={{ color: 'var(--text-primary)' }}>Scout</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>v1.3</p>
      </div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'var(--bg-elevated)',
        borderRadius: '12px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
          Activar licencia
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
          Ingresá tu código de activación para acceder a MiScout.
          Esta licencia quedará vinculada a este dispositivo.
        </p>

        <input
          type="text"
          placeholder="MISCOUT-v13-XXXX-XXXX"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--bg-base)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            letterSpacing: '0.05em',
            width: '100%',
          }}
        />

        {error && (
          <p style={{ color: 'var(--error, #ef4444)', fontSize: '0.85rem' }}>
            {error}
          </p>
        )}

        <button
          onClick={handleActivate}
          disabled={loading}
          className="btn btn-primary btn-full"
        >
          {loading ? 'Verificando...' : 'Activar'}
        </button>
      </div>

      {/* Legal warning */}
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '0.75rem',
        textAlign: 'center',
        maxWidth: '340px',
        lineHeight: 1.6,
      }}>
        © 2026 Cristian J. Lacout — Todos los derechos reservados.
        El uso no autorizado de esta licencia puede resultar en la 
        suspensión permanente del acceso sin reembolso.
      </p>
    </div>
  );
}
