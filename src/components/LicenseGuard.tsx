'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getDeviceFingerprint } from '@/lib/deviceFingerprint';

const UNPROTECTED_ROUTES = ['/activate', '/admin', '/guia'];

export default function LicenseGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Skip check for unprotected routes
    if (UNPROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
      setChecking(false);
      return;
    }

    const GRACE_PERIOD_MS = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

    const validateLicense = async () => {
      const savedCode    = localStorage.getItem('miscout_license');
      const savedFp      = localStorage.getItem('miscout_device_fp');
      const lastVerified = localStorage.getItem('miscout_last_verified');

      if (!savedCode || !savedFp) {
        router.push('/activate');
        return;
      }

      // elapsedMs is safe to compute here — only reads a string, never throws
      const lastVerifiedMs = lastVerified ? Date.parse(lastVerified) : NaN;
      const elapsedMs      = isNaN(lastVerifiedMs) ? Infinity : Date.now() - lastVerifiedMs;

      try {
        // getDeviceFingerprint() is inside try/catch — crypto.subtle failures
        // are handled the same way as network failures (see catch block below)
        const currentFp = await getDeviceFingerprint();

        // Grace period: allow offline access for up to 3 days since last
        // successful server check-in, to support users without connectivity
        // (e.g., at a game/tournament). Beyond 3 days, force re-validation.
        const needsServerCheck = elapsedMs >= GRACE_PERIOD_MS || currentFp !== savedFp;

        if (needsServerCheck) {
          const res = await fetch('/api/license/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: savedCode, deviceFingerprint: currentFp }),
          });
          const data = await res.json();

          if (data.valid) {
            localStorage.setItem('miscout_device_fp',     currentFp);
            localStorage.setItem('miscout_last_verified', new Date().toISOString());
            setChecking(false);
          } else {
            localStorage.removeItem('miscout_license');
            localStorage.removeItem('miscout_device_fp');
            localStorage.removeItem('miscout_last_verified');
            router.push('/activate');
          }
        } else {
          // Fast path: fingerprint matches and last check-in is recent — no server call
          setChecking(false);
        }

      } catch {
        // Catches ALL async failures: getDeviceFingerprint(), fetch(), or res.json()
        // Apply the same grace period logic regardless of failure cause
        if (elapsedMs < GRACE_PERIOD_MS) {
          // Still within grace window — allow access, but do NOT update
          // miscout_last_verified so the clock keeps ticking toward expiry
          setChecking(false);
        } else {
          // Grace period expired and we cannot complete validation — block access
          router.push('/activate');
        }
      }
    };

    validateLicense();
  }, [pathname, router]);

  if (checking && !UNPROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Verificando licencia...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
