import React from 'react';
import { X } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import { CountDownTime, Translation } from '../types';

interface PopupContentProps {
  timeLeft: CountDownTime;
  t: Translation;
  onClose: () => void;
  isPip?: boolean;
}

const PopupContent: React.FC<PopupContentProps> = ({ timeLeft, t, onClose, isPip }) => {
  return (
    <div className="bg-[#0d1016] w-full h-full flex flex-col items-center justify-center relative overflow-hidden border-4 border-[#151720]">
      {/* Drag Region */}
      <div className="absolute top-0 left-0 w-full h-8 bg-[#151720] flex justify-between items-center px-3 select-none -webkit-app-region-drag z-50">
        <span className="text-[10px] font-bold text-[#00bcf2] uppercase tracking-widest">Hytale Countdown</span>
        <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white hover:bg-red-500/20 p-1 rounded transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Main Content - Scaled Up for visibility */}
      <div className={`mt-6 transform origin-center transition-transform ${isPip ? 'scale-110 sm:scale-125' : 'scale-125'}`}>
        <CountdownTimer timeLeft={timeLeft} t={t} />
      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30 bg-[radial-gradient(circle_at_center,#00bcf2_0%,transparent_80%)]"></div>
    </div>
  );
};

export default PopupContent;