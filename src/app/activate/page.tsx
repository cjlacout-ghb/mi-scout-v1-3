'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDeviceFingerprint, getDeviceInfo } from '@/lib/deviceFingerprint';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { APP_VERSION_LABEL } from '@/lib/version';

export default function ActivatePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPwaWarning, setShowPwaWarning] = useState(false);
  const [activationSuccess, setActivationSuccess] = useState(false);

  useEffect(() => {
    // ── Guard: if already activated, skip the form and go straight to the app
    const existingLicense = localStorage.getItem('miscout_license');
    if (existingLicense) {
      router.replace('/');
      return;
    }

    // ── Standalone detection: warn if running in a regular browser tab
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (!isStandalone) {
      setShowPwaWarning(true);
    }
  }, []);

  const handleActivate = async () => {
    if (!code.trim()) {
      setError(t('activate.error_empty'));
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
        // Save activation locally
        localStorage.setItem('miscout_license',       code.trim().toUpperCase());
        localStorage.setItem('miscout_device_fp',     deviceFingerprint);
        localStorage.setItem('miscout_last_verified', new Date().toISOString());
        // Show success screen instead of redirecting immediately;
        // the mount guard ensures any re-entry to /activate redirects to /.
        setActivationSuccess(true);
      } else {
        // If errorCode is present and mapped in dictionary, show translated message.
        // Fallback: raw error string from API (Spanish), or generic local error.
        const errorKey = data.errorCode ? `error.${data.errorCode}` : null;
        const translatedError = errorKey ? t(errorKey) : null;
        // t() returns the key itself when not found — check for that
        const hasTranslation = translatedError && translatedError !== errorKey;
        setError(hasTranslation ? translatedError : (data.error || t('activate.error_invalid')));
      }
    } catch {
      setError(t('activate.error_connection'));
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
      {/* Language toggle — esquina superior derecha */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <LanguageToggle />
      </div>

      {/* Logo */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Mi<span style={{ color: 'var(--accent)' }}>Scout</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{APP_VERSION_LABEL}</p>
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
        {activationSuccess ? (
          // ── Success screen ─────────────────────────────────────────────
          <>
            <h2 style={{ color: 'var(--accent)', fontSize: '1.1rem', fontWeight: 700 }}>
              {t('activate.success_title')}
            </h2>

            {/* PWA reminder only shown when NOT already in standalone mode */}
            {showPwaWarning && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                {t('activate.success_message')}
              </p>
            )}

            <button
              onClick={() => router.push('/')}
              className="btn btn-primary btn-full"
            >
              {t('activate.success_button')}
            </button>
          </>
        ) : (
          // ── Activation form ────────────────────────────────────────────
          <>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
              {t('activate.title')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              {t('activate.subtitle')}{' '}
              <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Mi</span><span style={{ color: '#F5A623', fontWeight: 700 }}>Scout</span>.{' '}
              {t('activate.subtitle_suffix')}
            </p>

            {showPwaWarning && (
              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(245, 166, 35, 0.1)',
                border: '1px solid rgba(245, 166, 35, 0.3)',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                lineHeight: 1.5
              }}>
                {t('activate.pwa_warning')}
              </div>
            )}

            <input
              type="text"
              placeholder={t('activate.placeholder_code')}
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
              {loading ? t('activate.button_activating') : t('activate.button_activate')}
            </button>
          </>
        )}
      </div>

      {/* Legal warning */}
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '0.75rem',
        textAlign: 'center',
        maxWidth: '340px',
        lineHeight: 1.6,
      }}>
        {t('activate.legal').split('MiScout').map((part, i, arr) =>
          i < arr.length - 1 ? (
            <span key={i}>
              {part}
              <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Mi</span><span style={{ color: '#F5A623', fontWeight: 700 }}>Scout</span>
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </p>
    </div>
  );
}
