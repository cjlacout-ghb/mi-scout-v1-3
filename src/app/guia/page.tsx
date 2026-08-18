'use client';

import { useRouter } from 'next/navigation';
import { APP_VERSION_LABEL } from '@/lib/version';
import { useLanguage } from '@/context/LanguageContext';
import GuiaES from './GuiaES';
import GuiaEN from './GuiaEN';

export default function GuiaPage() {
  const router = useRouter();
  const { locale } = useLanguage();

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header de la guía */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: '1.4rem',
            lineHeight: 1,
            padding: '0 4px',
            flexShrink: 0,
          }}
          aria-label={locale === 'es' ? 'Volver' : 'Back'}
        >
          ←
        </button>
        <div>
          <h1 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            {locale === 'es' ? 'Guía de Usuario' : 'User Guide'}
          </h1>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>MiScout {APP_VERSION_LABEL}</p>
        </div>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: 680, margin: '0 auto' }}>
        {locale === 'es' ? <GuiaES /> : <GuiaEN />}
      </div>
    </div>
  );
}
