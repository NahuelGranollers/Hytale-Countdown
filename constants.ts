import { Translation, Milestone } from './types';

// Start Date: December 13, 2018 (Hytale Announcement)
export const START_DATE_ISO = '2018-12-13T00:00:00Z';

// Target Date: January 13, 2026, 16:00 Spain Time (12:00 PM EST)
export const TARGET_DATE_ISO = '2026-01-13T16:00:00+01:00';

export const MILESTONES_DATA: Milestone[] = ([
  { date: '2026-01-08', year: '2026', title: "A look at Hytale's Lore and Philosophy", type: 'blog' },
  { date: '2026-01-05', year: '2026', title: "The Future of World Generation", type: 'technical' },
  { date: '2025-12-22', year: '2025', title: "An Introduction to Making Models for Hytale", type: 'technical' },
  { date: '2025-12-03', year: '2025', title: "Hytale's 1st FAQ", type: 'community' },
  { date: '2025-12-01', year: '2025', title: "Hytale Hardware Requirements", major: true, type: 'technical' },
  { date: '2025-11-28', year: '2025', title: "Hytale Early Access: January 13, 2026", major: true, type: 'announcement' },
  { date: '2025-11-25', year: '2025', title: "Hytale Creative Mode", type: 'blog' },
  { date: '2025-11-20', year: '2025', title: "Hytale Modding Strategy and Status", type: 'technical' },
  { date: '2025-11-17', year: '2025', title: "HYTALE IS SAVED! (Project Repurchased)", major: true, type: 'announcement' },
  { date: '2025-03-28', year: '2025', title: "Spring 2025 Development Update", type: 'development' },
  { date: '2024-12-17', year: '2024', title: "Winter 2024 Development Update", type: 'development' },
  { date: '2024-12-10', year: '2024', title: "Technical Explainer: Launch Pads", type: 'technical' },
  { date: '2024-07-29', year: '2024', title: "Summer 2024 Development Update", major: true, type: 'development' },
  { date: '2024-06-17', year: '2024', title: "Technical Explainer: Entity Component System", type: 'technical' },
  { date: '2023-11-30', year: '2023', title: "Winter 2023 Development Update", type: 'development' },
  { date: '2023-06-27', year: '2023', title: "Studio growth and project progress", type: 'blog' },
  { date: '2022-07-22', year: '2022', title: "Summer 2022 Development Update", type: 'development' },
  { date: '2021-11-24', year: '2021', title: "Winter 2021 Development Update", type: 'development' },
  { date: '2021-07-01', year: '2021', title: "Summer 2021 Development Update", major: true, type: 'development' },
  { date: '2020-12-10', year: '2020', title: "December 2020 Development Update", type: 'development' },
  { date: '2020-09-24', year: '2020', title: "Hytale Fan Art Showcase Vol. 4", type: 'community' },
  { date: '2020-08-31', year: '2020', title: "Progress Update: August 2020", type: 'development' },
  { date: '2020-07-30', year: '2020', title: "Progress Update: July 2020", type: 'development' },
  { date: '2020-06-29', year: '2020', title: "Landscape generation in Hytale", type: 'technical' },
  { date: '2020-05-30', year: '2020', title: "Progress Update: May 2020", type: 'development' },
  { date: '2020-04-30', year: '2020', title: "Progress Update: April 2020", type: 'development' },
  { date: '2020-04-16', year: '2020', title: "Entering a new era for Hypixel Studios", major: true, type: 'announcement' },
  { date: '2020-03-26', year: '2020', title: "Progress Update: March 2020", type: 'development' },
  { date: '2020-02-27', year: '2020', title: "Inside the Hytale foley studio", type: 'blog' },
  { date: '2020-01-29', year: '2020', title: "Progress Update: January 2020", type: 'development' },
  { date: '2019-12-12', year: '2019', title: "Progress Update: December 2019", type: 'development' },
  { date: '2019-11-27', year: '2019', title: "Hytale graphics update", major: true, type: 'technical' },
  { date: '2019-08-20', year: '2019', title: "Custom content in Hytale", type: 'technical' },
  { date: '2019-07-24', year: '2019', title: "Outlanders revealed", type: 'blog' },
  { date: '2019-05-03', year: '2019', title: "Rising expectations, new challenges", type: 'blog' },
  { date: '2019-04-26', year: '2019', title: "Designing monsters for Hytale", type: 'blog' },
  { date: '2019-04-19', year: '2019', title: "Creating creature sounds", type: 'blog' },
  { date: '2019-04-12', year: '2019', title: "A visual tour of zone 3", type: 'blog' },
  { date: '2019-04-04', year: '2019', title: "Building NPC behaviors", type: 'technical' },
  { date: '2019-03-29', year: '2019', title: "Creating a new point of interest", type: 'blog' },
  { date: '2019-03-22', year: '2019', title: "Three new pieces of music", type: 'blog' },
  { date: '2019-03-08', year: '2019', title: "Building with blocks", type: 'blog' },
  { date: '2019-03-01', year: '2019', title: "Zone 1 wildlife", type: 'blog' },
  { date: '2019-02-22', year: '2019', title: "Fan Art Showcase vol. 1", type: 'community' },
  { date: '2019-02-15', year: '2019', title: "Customizing your character", type: 'blog' },
  { date: '2019-02-08', year: '2019', title: "Exploring Hytale block tech", type: 'technical' },
  { date: '2019-02-01', year: '2019', title: "Key art showcase", type: 'community' },
  { date: '2019-01-25', year: '2019', title: "Hytale server technology", type: 'technical' },
  { date: '2019-01-18', year: '2019', title: "Hytale Model Maker", type: 'technical' },
  { date: '2019-01-13', year: '2019', title: "Music track preview & FAQ", type: 'community' },
  { date: '2019-01-04', year: '2019', title: "Worldgen Introduction", type: 'technical' },
  { date: '2018-12-20', year: '2018', title: "Happy holidays from Hytale", type: 'community' },
  { date: '2018-12-13', year: '2018', title: "Hytale Announcement", major: true, type: 'announcement' }
] as Milestone[]).map(m => ({ ...m, url: m.url || 'https://hytale.com/news' }));

export const TRANSLATIONS: Record<string, Translation> = {
  en: {
    seo: {
      title: "Hytale Countdown | Early Access Launch January 13, 2026",
      description: "🎮 Hytale Early Access launches Jan 13, 2026. Pre-orders live. Adventure Mode, Creative tools & more. The wait is almost over!",
      h1: "Hytale Early Access: 13th January 2026",
      keywords: "Hytale, Hytale release date, Hytale Early Access, Hytale countdown, Hypixel Studios, Minecraft competitor, Sandbox RPG"
    },
    nav: {
      blog: "BLOG",
      media: "MEDIA",
      game: "GAME",
      community: "COMMUNITY",
      account: "ACCOUNT",
      logout: "LOGOUT",
    },
    hero: {
      title: "HYTALE LAUNCH",
      subtitle: "The adventure begins January 13, 2026",
      cta: "Pre-Orders Are Live Here!",
      socials: "Hytale's Official Socials"
    },
    progress: {
      label: "DEVELOPMENT TIMELINE",
      start: "ANNOUNCEMENT",
      end: "LAUNCH",
      zoomIn: "ZOOM IN",
      zoomOut: "ZOOM OUT"
    },
    footer: {
      disclaimer: "Fan-made countdown. Not affiliated with Hypixel Studios.",
      rights: "© 2026 Hytale Fan Page.",
    },
    time: {
      days: "DAYS",
      hours: "HOURS",
      minutes: "MINUTES",
      seconds: "SECONDS",
      finished: "AVAILABLE NOW",
    },
    categories: {
      announcement: "Announcement",
      development: "Development",
      technical: "Technical",
      community: "Community",
      blog: "Blog/Other"
    }
  },
  es: {
    seo: {
      title: "Hytale Cuenta Atrás | Lanzamiento Early Access 13 Enero 2026",
      description: "🎮 Hytale Early Access el 13 de enero 2026. Reserva ahora desde $19.99. Adventure Mode y herramientas de modding. ¡Cuenta atrás oficial!",
      h1: "Hytale Early Access: 13 de Enero 2026",
      keywords: "Hytale, Hytale lanzamiento, Hytale Early Access, Hytale cuenta atrás, comprar Hytale, requisitos Hytale, fecha salida Hytale"
    },
    nav: {
      blog: "BLOG",
      media: "MEDIA",
      game: "JUEGO",
      community: "COMUNIDAD",
      account: "CUENTA",
      logout: "SALIR",
    },
    hero: {
      title: "LANZAMIENTO DE HYTALE",
      subtitle: "La aventura comienza el 13 de Enero de 2026",
      cta: "¡Las reservas ya están disponibles!",
      socials: "Redes Oficiales de Hytale"
    },
    progress: {
      label: "LÍNEA DE TIEMPO",
      start: "ANUNCIO",
      end: "LANZAMIENTO",
      zoomIn: "ACERCAR",
      zoomOut: "ALEJAR"
    },
    footer: {
      disclaimer: "Cuenta atrás hecha por fans. No afiliado con Hypixel Studios.",
      rights: "© 2024 Página Fan de Hytale.",
    },
    time: {
      days: "DÍAS",
      hours: "HORAS",
      minutes: "MINUTOS",
      seconds: "SEGUNDOS",
      finished: "DISPONIBLE AHORA",
    },
    categories: {
      announcement: "Anuncio",
      development: "Desarrollo",
      technical: "Técnico",
      community: "Comunidad",
      blog: "Blog/Otro"
    }
  }
};