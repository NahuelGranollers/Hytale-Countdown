import React, { useState, useEffect } from 'react';
import CountdownTimer from './components/CountdownTimer';
import { TRANSLATIONS, TARGET_DATE_ISO, START_DATE_ISO } from './constants';
import { CountDownTime, Language } from './types';
import { X } from 'lucide-react';

const PopupApp: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<CountDownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [lang, setLang] = useState<Language>('en');

  // Parse query params for language
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang') as Language;
    if (langParam === 'es' || langParam === 'en') {
      setLang(langParam);
    }
  }, []);

  const t = TRANSLATIONS[lang];

  // Timer Logic (Identical to App.tsx for synchronization)
  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const target = new Date(TARGET_DATE_ISO).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, []);

  const closePopup = () => {
    window.close();
  };

  return (
    <div className="bg-[#0d1016] w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden border-4 border-[#151720]">
      {/* Drag Region for window moving (if supported by OS/Browser) */}
      <div className="absolute top-0 left-0 w-full h-6 bg-[#151720] flex justify-between items-center px-2 select-none -webkit-app-region-drag">
        <span className="text-[9px] font-bold text-[#00bcf2] uppercase tracking-widest">Hytale Countdown</span>
        <button onClick={closePopup} className="text-gray-400 hover:text-white">
          <X size={12} />
        </button>
      </div>

      {/* Main Content */}
      <div className="mt-4 scale-75 transform origin-center">
        <CountdownTimer timeLeft={timeLeft} t={t} />
      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-[-1] opacity-20 bg-[radial-gradient(circle_at_center,#00bcf2_0%,transparent_70%)]"></div>
    </div>
  );
};

export default PopupApp;