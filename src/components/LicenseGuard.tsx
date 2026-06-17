'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getDeviceFingerprint } from '@/lib/deviceFingerprint';

const UNPROTECTED_ROUTES = ['/activate', '/admin'];

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

    const validateLicense = async () => {
      try {
        const savedCode = localStorage.getItem('miscout_license');
        const savedFp = localStorage.getItem('miscout_device_fp');

        if (!savedCode || !savedFp) {
          router.push('/activate');
          return;
        }

        // Verify fingerprint matches current device
        const currentFp = await getDeviceFingerprint();
        if (currentFp !== savedFp) {
          // Fingerprint mismatch — re-validate against server
          const res = await fetch('/api/license/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: savedCode,
              deviceFingerprint: currentFp,
            }),
          });
          const data = await res.json();
          if (!data.valid) {
            localStorage.removeItem('miscout_license');
            localStorage.removeItem('miscout_device_fp');
            router.push('/activate');
            return;
          }
          // Update saved fingerprint
          localStorage.setItem('miscout_device_fp', currentFp);
        }

        setChecking(false);
      } catch {
        // On network error, allow access if license exists locally
        const savedCode = localStorage.getItem('miscout_license');
        if (!savedCode) {
          router.push('/activate');
        } else {
          setChecking(false);
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
