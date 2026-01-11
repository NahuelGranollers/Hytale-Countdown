import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import CountdownTimer from './components/CountdownTimer';
import ProgressBar from './components/ProgressBar';
import FloatingWidget from './components/FloatingWidget';
import BackgroundParticles from './components/BackgroundParticles';
import { TRANSLATIONS, TARGET_DATE_ISO, START_DATE_ISO } from './constants';
import { CountDownTime, Language, Theme } from './types';
import { Twitter, Youtube, Instagram, Gamepad2 } from 'lucide-react';

const App: React.FC = () => {
  // 1. Language Detection
  const [lang, setLang] = useState<Language>('en');
  // 2. Theme State (Enforced Dark Mode)
  const theme: Theme = 'dark';

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'es') {
      setLang('es');
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'en' ? 'es' : 'en');
  }, []);

  const t = TRANSLATIONS[lang];

  // --- SEO DYNAMIC INJECTION ---
  useEffect(() => {
    document.title = t.seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t.seo.description);
    
    const metaKeys = document.querySelector('meta[name="keywords"]');
    if (metaKeys) metaKeys.setAttribute("content", t.seo.keywords);
    
    document.documentElement.lang = lang;

    const jsonLdData = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "Hytale Early Access Launch",
      "description": t.seo.description,
      "startDate": TARGET_DATE_ISO,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
      "image": "https://img.goodfon.com/original/1920x1080/1/4c/hytale-peizazh-landshaft-nebo-zelen.jpg",
      "location": {
        "@type": "VirtualLocation",
        "url": "https://hytale.com"
      },
      "organizer": {
        "@type": "Organization",
        "name": "Hypixel Studios",
        "url": "https://hytale.com"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://hytale.com/pre-order",
        "price": "19.99",
        "priceCurrency": "USD",
        "availability": "https://schema.org/PreOrder",
        "availabilityStarts": "2025-12-13",
        "availabilityEnds": "2026-01-13"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLdData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [lang, t]);


  // 3. Countdown Logic
  const calculateTimeLeft = useCallback((): CountDownTime => {
    const difference = +new Date(TARGET_DATE_ISO) - +new Date();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, []);

  const [timeLeft, setTimeLeft] = useState<CountDownTime>(calculateTimeLeft());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(START_DATE_ISO).getTime();
      const target = new Date(TARGET_DATE_ISO).getTime();
      const currentDifference = target - now;
      const totalDuration = target - start;
      
      let pct = ((now - start) / totalDuration) * 100;
      pct = Math.min(100, Math.max(0, pct));
      setProgress(pct);

      if (currentDifference > 0) {
        setTimeLeft({
          days: Math.floor(currentDifference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((currentDifference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((currentDifference / 1000 / 60) % 60),
          seconds: Math.floor((currentDifference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`${theme} font-sans`}>
        {/* Force full height (100dvh) and hide overflow to prevent scrolling */}
        <div className="h-[100dvh] w-full relative flex flex-col bg-[#0d1016] text-white selection:bg-[#ffc107] selection:text-black overflow-hidden">
            
            {/* Background Image Layer - Optimized for LCP */}
            <div className="fixed inset-0 z-0">
                <img 
                    src="https://img.goodfon.com/original/1920x1080/1/4c/hytale-peizazh-landshaft-nebo-zelen.jpg" 
                    alt="Hytale Orbis Landscape with trees and mountains"
                    width="1920"
                    height="1080"
                    // @ts-ignore - fetchPriority is valid in modern browsers but missing in React types sometimes
                    fetchPriority="high"
                    loading="eager"
                    className="w-full h-full object-cover opacity-60 md:opacity-50 transition-opacity duration-700 select-none"
                />
            </div>

            {/* Particle Effects Layer */}
            <div className="fixed inset-0 z-0 opacity-60">
                <BackgroundParticles theme={theme} />
            </div>

            {/* Dark Overlay Gradients for Readability */}
            <div className="fixed inset-0 bg-gradient-to-b from-[#0d1016]/40 via-[#0d1016]/20 to-[#0d1016]/95 z-0 pointer-events-none"></div>
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0d1016_100%)] z-0 pointer-events-none opacity-60"></div>

            <Navbar t={t} lang={lang} toggleLang={toggleLang} />

            {/* Floating Widget - Always on top */}
            <FloatingWidget timeLeft={timeLeft} t={t} />

            {/* Main Content - Flex Column with Justify Evenly to distribute space automatically */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-evenly px-4 w-full max-w-[1920px] mx-auto pt-14 md:pt-20 pb-2 md:pb-4 h-full">
                
                {/* Spacer (Hidden, purely for flex balance if needed) */}
                <div className="hidden md:block h-0 shrink-0"></div>

                {/* Countdown Section */}
                <div className="flex flex-col items-center justify-center shrink-0">
                    {/* Scale down slightly on very small screens if needed */}
                    <div className="scale-75 xs:scale-90 sm:scale-100 transition-transform origin-center">
                         <CountdownTimer timeLeft={timeLeft} t={t} />
                    </div>

                    <h1 className="font-fantasy text-[#ffc107] text-[10px] sm:text-xs md:text-lg tracking-widest mt-2 md:mt-6 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] text-center animate-fade-in-down font-bold">
                        {t.seo.h1.toUpperCase()}
                    </h1>
                </div>

                {/* CTA Button */}
                <div className="shrink-0 scale-90 md:scale-100">
                    <a href="https://hytale.com/" target="_blank" rel="noopener noreferrer" 
                    className="group relative px-6 py-2.5 md:px-8 md:py-3 bg-[#162b4d]/90 backdrop-blur-md border-2 border-[#3a5b78] hover:border-[#00bcf2] hover:bg-[#1a3663] text-white font-display font-bold uppercase tracking-wider text-[10px] md:text-base transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(0,188,242,0.4)] overflow-hidden inline-block rounded-sm"
                    aria-label={t.hero.cta}
                    >
                        <span className="relative z-10">{t.hero.cta}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </a>
                </div>

                {/* Progress Bar Section - Takes available space but restricted max height */}
                <div className="w-full max-w-6xl shrink-0 flex flex-col items-center justify-center">
                     <ProgressBar percentage={progress} t={t} />
                </div>

                {/* Socials & Footer */}
                <div className="flex flex-col items-center gap-2 md:gap-3 shrink-0">
                    <p className="font-display text-[#bdcbe6] text-[8px] md:text-[10px] tracking-widest uppercase opacity-90 drop-shadow-md font-bold">{t.hero.socials}</p>
                    <div className="flex gap-4 md:gap-6 text-[#bdcbe6]">
                         <a href="https://twitter.com/hytale" target="_blank" rel="noopener" aria-label="Hytale Twitter" className="hover:text-[#ffc107] hover:scale-110 transition-all drop-shadow-md"><Twitter size={16} className="md:w-5 md:h-5" /></a>
                         <a href="https://instagram.com/hytale" target="_blank" rel="noopener" aria-label="Hytale Instagram" className="hover:text-[#ffc107] hover:scale-110 transition-all drop-shadow-md"><Instagram size={16} className="md:w-5 md:h-5" /></a>
                         <a href="https://youtube.com/hytale" target="_blank" rel="noopener" aria-label="Hytale Youtube" className="hover:text-[#ffc107] hover:scale-110 transition-all drop-shadow-md"><Youtube size={16} className="md:w-5 md:h-5" /></a>
                         <a href="https://hytale.com" target="_blank" rel="noopener" aria-label="Hytale Official Site" className="hover:text-[#ffc107] hover:scale-110 transition-all drop-shadow-md"><Gamepad2 size={16} className="md:w-5 md:h-5" /></a>
                    </div>
                    <div className="text-center mt-1 md:mt-2">
                        <p className="text-[#8ba2bf] text-[8px] md:text-[9px] uppercase tracking-wide drop-shadow-sm font-semibold">
                           {t.footer.disclaimer}
                        </p>
                    </div>
                </div>

            </main>
        </div>
    </div>
  );
};

export default App;