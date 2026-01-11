import React from 'react';
import { Translation, CountDownTime } from '../types';

interface CountdownTimerProps {
  timeLeft: CountDownTime;
  t: Translation;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ timeLeft, t }) => {
  const formatTime = (val: number) => val.toString().padStart(2, '0');

  // Helper for the "02 D" format
  const TimeItem = ({ val, suffix }: { val: number; suffix: string }) => (
    <div className="flex items-baseline gap-0.5 md:gap-2 mx-0.5 md:mx-0">
      <span className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-fantasy text-[#ffc107] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
        {formatTime(val)}
      </span>
      <span className="text-[10px] xs:text-xs sm:text-xl md:text-2xl font-fantasy text-[#ffc107] opacity-80 mr-1 md:mr-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] self-end mb-1 md:mb-4">
        {suffix.charAt(0)}
      </span>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center items-center py-1 md:py-4 select-none">
       <TimeItem val={timeLeft.days} suffix={t.time.days} />
       <TimeItem val={timeLeft.hours} suffix={t.time.hours} />
       <TimeItem val={timeLeft.minutes} suffix={t.time.minutes} />
       <TimeItem val={timeLeft.seconds} suffix={t.time.seconds} />
    </div>
  );
};

export default CountdownTimer;