import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'INGENIA BASE — Bóveda de Gestión Documental',
    short_name: 'INGENIA BASE',
    description: 'Plataforma segura para el almacenamiento y organización de documentos corporativos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1219', // Coincide con tu --color-surface-900
    theme_color: '#34d399',      // Coincide con tu --color-accent
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
