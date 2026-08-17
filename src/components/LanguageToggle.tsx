'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      <button
        onClick={() => setLocale('es')}
        className={`btn ${locale === 'es' ? 'btn-primary' : 'btn-ghost'}`}
        style={{ padding: '4px 8px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
      >
        ES
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`btn ${locale === 'en' ? 'btn-primary' : 'btn-ghost'}`}
        style={{ padding: '4px 8px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
      >
        EN
      </button>
    </div>
  );
}
