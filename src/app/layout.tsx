import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ScoutProvider } from '@/context/ScoutContext';
import AppShell from '@/components/AppShell';
import LicenseGuard from '@/components/LicenseGuard';

export const metadata: Metadata = {
  title: 'MiScout | Tracking de pitcheos',
  description: 'Aplicación de scouting y tracking de lanzamientos para softball. Análisis por bateador con heat map y reportes.',
  manifest: '/manifest.json',
  icons: {
    icon: '/assets/icon-192.png',
    apple: '/assets/icon-192.png',
  },
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MiScout',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0D0F14',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <LicenseGuard>
          <ScoutProvider>
            <AppShell>{children}</AppShell>
          </ScoutProvider>
        </LicenseGuard>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
