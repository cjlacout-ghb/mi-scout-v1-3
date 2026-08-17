'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale } from '@/lib/i18n/types';
import { dictionary } from '@/lib/i18n/dictionary';
import { valueLabels } from '@/lib/i18n/valueLabels';

interface LanguageContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  tv: (valorInterno: string, short?: boolean) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('miscout_locale');
    if (saved === 'es' || saved === 'en') {
      setLocaleState(saved);
    } else {
      const browserLang = navigator.language;
      const initialLocale = browserLang.startsWith('en') ? 'en' : 'es';
      setLocaleState(initialLocale);
      localStorage.setItem('miscout_locale', initialLocale);
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('miscout_locale', newLocale);
  };

  const t = (key: string): string => {
    const translation = dictionary[locale]?.[key];
    return translation !== undefined ? translation : key;
  };

  const tv = (valorInterno: string, short?: boolean): string => {
    const entry = valueLabels[valorInterno];
    if (!entry) return valorInterno;
    if (short) {
      // Try short variant for current locale, fallback to normal label
      const shortKey = `${locale}_short` as keyof typeof entry;
      const shortLabel = entry[shortKey];
      return shortLabel !== undefined ? String(shortLabel) : (entry[locale] ?? valorInterno);
    }
    return entry[locale] ?? valorInterno;
  };

  if (!mounted) {
    return <div style={{ background: 'var(--bg-base)', minHeight: '100dvh' }} />;
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, tv }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
