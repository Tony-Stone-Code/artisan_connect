import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ArtisanConnect Ghana',
    short_name: 'ArtisanConnect',
    description: 'Find, hire, and pay verified artisans with escrow protection across Ghana.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8FAFC',
    theme_color: '#002B49',
    orientation: 'portrait-primary',
    lang: 'en-GH',
    categories: ['business', 'productivity', 'utilities'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Find Artisans',
        short_name: 'Find',
        description: 'Search verified artisans across Accra, Kumasi, and all regions',
        url: '/artisans',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'My Job Requests',
        short_name: 'Requests',
        description: 'View your ongoing and quoted service requests',
        url: '/dashboard/requests',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Live Messages',
        short_name: 'Messages',
        description: 'Chat in realtime with your artisans and customers',
        url: '/dashboard/messages',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
