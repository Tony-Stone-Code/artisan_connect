export interface TradeMediaInfo {
  trade: string;
  avatarUrl: string;
  coverUrl: string;
  accentColor: string;
  iconName: string;
  portfolio: string[];
}

export const TRADE_MEDIA: Record<string, TradeMediaInfo> = {
  Plumbing: {
    trade: 'Plumbing',
    avatarUrl: '/images/artisan_plumber_1782323020851.png',
    coverUrl: '/images/ghana_artisan_hero_bg.jpg',
    accentColor: 'from-blue-600/40 via-cyan-500/20 to-transparent',
    iconName: 'Wrench',
    portfolio: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80',
    ],
  },
  Electrical: {
    trade: 'Electrical',
    avatarUrl: '/images/artisan_electrician_ghana.jpg',
    coverUrl: '/images/artisan_electrician_1782323029739.png',
    accentColor: 'from-amber-600/40 via-yellow-500/20 to-transparent',
    iconName: 'Zap',
    portfolio: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
    ],
  },
  Carpentry: {
    trade: 'Carpentry',
    avatarUrl: '/images/artisan_carpenter_1782323041206.png',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Carpenters_roofing_stores_in_Northern_Ghana.jpg',
    accentColor: 'from-orange-700/40 via-amber-600/20 to-transparent',
    iconName: 'Hammer',
    portfolio: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
    ],
  },
  'Auto Mechanics': {
    trade: 'Auto Mechanics',
    avatarUrl: '/images/artisan_mechanic_ghana.jpg',
    coverUrl: '/images/artisan_mechanic_ghana.jpg',
    accentColor: 'from-red-600/40 via-rose-500/20 to-transparent',
    iconName: 'Car',
    portfolio: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=600&q=80',
    ],
  },
  'Masonry & Construction': {
    trade: 'Masonry & Construction',
    avatarUrl: '/images/artisan_mason_ghana.jpg',
    coverUrl: '/images/artisan_mason_ghana.jpg',
    accentColor: 'from-emerald-600/40 via-teal-500/20 to-transparent',
    iconName: 'HardHat',
    portfolio: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    ],
  },
  'Cleaning & Landscaping': {
    trade: 'Cleaning & Landscaping',
    avatarUrl: '/images/artisan_electrician_ghana.jpg',
    coverUrl: '/images/ghana_artisan_hero_bg.jpg',
    accentColor: 'from-green-600/40 via-lime-500/20 to-transparent',
    iconName: 'Sparkles',
    portfolio: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
    ],
  },
};

export const DEFAULT_TRADE_MEDIA: TradeMediaInfo = {
  trade: 'General Tradesperson',
  avatarUrl: '/images/artisan_plumber_1782323020851.png',
  coverUrl: '/images/ghana_artisan_hero_bg.jpg',
  accentColor: 'from-primary/40 via-primary/20 to-transparent',
  iconName: 'Briefcase',
  portfolio: [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
  ],
};

export function getTradeMedia(categoryName?: string | null): TradeMediaInfo {
  if (!categoryName) return DEFAULT_TRADE_MEDIA;

  if (TRADE_MEDIA[categoryName]) {
    return TRADE_MEDIA[categoryName];
  }

  const lower = categoryName.toLowerCase();
  if (lower.includes('plumb') || lower.includes('pipe') || lower.includes('leak')) {
    return TRADE_MEDIA['Plumbing'];
  }
  if (lower.includes('elect') || lower.includes('wire') || lower.includes('power') || lower.includes('light')) {
    return TRADE_MEDIA['Electrical'];
  }
  if (lower.includes('carpent') || lower.includes('wood') || lower.includes('furnit') || lower.includes('door')) {
    return TRADE_MEDIA['Carpentry'];
  }
  if (lower.includes('auto') || lower.includes('mechanic') || lower.includes('car') || lower.includes('vehicle')) {
    return TRADE_MEDIA['Auto Mechanics'];
  }
  if (lower.includes('mason') || lower.includes('construct') || lower.includes('tile') || lower.includes('paint') || lower.includes('build')) {
    return TRADE_MEDIA['Masonry & Construction'];
  }
  if (lower.includes('clean') || lower.includes('mow') || lower.includes('pest') || lower.includes('landscape')) {
    return TRADE_MEDIA['Cleaning & Landscaping'];
  }

  return DEFAULT_TRADE_MEDIA;
}
