import React from 'react';
import { X, GripHorizontal } from 'lucide-react';
import { CountDownTime, Translation } from '../types';

interface PopupContentProps {
  timeLeft: CountDownTime;
  t: Translation;
  onClose: () => void;
  isPip?: boolean;
}

const PopupContent: React.FC<PopupContentProps> = ({ timeLeft, t, onClose, isPip }) => {
  const format = (n: number) => n.toString().padStart(2, '0');

  // Unified design for both PiP and Popup modes to match FloatingWidget
  return (
    <div className="bg-[#080a0f] w-full h-full flex flex-col overflow-hidden select-none">
        
        {/* Header - Dark grey background, cyan text */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#151720] border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
                <GripHorizontal size={18} className="text-gray-500 opacity-60" />
                <span className="font-display font-bold text-[11px] tracking-[0.2em] text-[#00bcf2] uppercase pt-0.5">
                    HYTALE LAUNCH
                </span>
            </div>
            <button 
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors"
                title="Close"
            >
                <X size={18} />
            </button>
        </div>

        {/* Content - Pitch dark background, white text, yellow labels */}
        <div className="flex-1 flex items-center justify-center bg-[#080a0f]">
            <div className="flex items-start justify-center gap-3 sm:gap-4 scale-90 sm:scale-100 origin-center">
                {/* Days */}
                <div className="flex flex-col items-center gap-2">
                    <span className="font-sans font-bold text-4xl sm:text-5xl text-white leading-none tracking-wide drop-shadow-sm">{format(timeLeft.days)}</span>
                    <span className="font-bold text-[10px] text-[#ffc107] uppercase leading-none">{t.time.days.substring(0, 1)}</span>
                </div>

                <div className="text-gray-700 font-bold text-2xl sm:text-3xl leading-none mt-2 opacity-50">:</div>

                {/* Hours */}
                <div className="flex flex-col items-center gap-2">
                    <span className="font-sans font-bold text-4xl sm:text-5xl text-white leading-none tracking-wide drop-shadow-sm">{format(timeLeft.hours)}</span>
                    <span className="font-bold text-[10px] text-[#ffc107] uppercase leading-none">{t.time.hours.substring(0, 1)}</span>
                </div>

                <div className="text-gray-700 font-bold text-2xl sm:text-3xl leading-none mt-2 opacity-50">:</div>

                {/* Minutes */}
                <div className="flex flex-col items-center gap-2">
                    <span className="font-sans font-bold text-4xl sm:text-5xl text-white leading-none tracking-wide drop-shadow-sm">{format(timeLeft.minutes)}</span>
                    <span className="font-bold text-[10px] text-[#ffc107] uppercase leading-none">{t.time.minutes.substring(0, 1)}</span>
                </div>

                <div className="text-gray-700 font-bold text-2xl sm:text-3xl leading-none mt-2 opacity-50">:</div>

                {/* Seconds */}
                <div className="flex flex-col items-center gap-2">
                    <span className="font-sans font-bold text-4xl sm:text-5xl text-white leading-none tracking-wide drop-shadow-sm tabular-nums">{format(timeLeft.seconds)}</span>
                    <span className="font-bold text-[10px] text-[#ffc107] uppercase leading-none">{t.time.seconds.substring(0, 1)}</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PopupContent;