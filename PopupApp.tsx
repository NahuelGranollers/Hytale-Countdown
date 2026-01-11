import React, { useState, useEffect } from 'react';
import PopupContent from './components/PopupContent';
import { TRANSLATIONS, TARGET_DATE_ISO } from './constants';
import { CountDownTime, Language } from './types';

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
    <div className="w-screen h-screen">
        <PopupContent timeLeft={timeLeft} t={t} onClose={closePopup} />
    </div>
  );
};

export default PopupApp;