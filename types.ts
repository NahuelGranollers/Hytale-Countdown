export interface CountDownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export type Language = 'en' | 'es';
export type Theme = 'light' | 'dark';

export type MilestoneCategory = 'announcement' | 'development' | 'technical' | 'community' | 'blog';

export interface Milestone {
  date: string;
  year: string;
  title: string;
  url?: string;
  major?: boolean;
  type: MilestoneCategory;
}

export interface Translation {
  seo: {
    title: string;
    description: string;
    h1: string; // Semantic H1
    keywords: string;
  };
  nav: {
    blog: string;
    media: string;
    game: string;
    community: string;
    account: string;
    logout: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    socials: string;
  };
  progress: {
    label: string;
    start: string;
    end: string;
    zoomIn: string;
    zoomOut: string;
  };
  footer: {
    disclaimer: string;
    rights: string;
  };
  time: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    finished: string;
  };
  categories: {
    announcement: string;
    development: string;
    technical: string;
    community: string;
    blog: string;
  };
}