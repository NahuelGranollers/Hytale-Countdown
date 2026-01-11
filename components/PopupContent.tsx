import React from 'react';
import { X, Activity } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import { CountDownTime, Translation } from '../types';

interface PopupContentProps {
  timeLeft: CountDownTime;
  t: Translation;
  onClose: () => void;
  isPip?: boolean;
}

const PopupContent: React.FC<PopupContentProps> = ({ timeLeft, t, onClose, isPip }) => {
  
  // --- SUPER MINIMALIST MODE (For Picture-in-Picture) ---
  if (isPip) {
    const f = (n: number) => n.toString().padStart(2, '0');
    
    return (
        <div className="bg-black w-full h-full flex flex-col items-center justify-center overflow-hidden select-none cursor-default">
            {/* Main Digits Container - Scales with viewport width */}
            <div className="flex items-center justify-center gap-[1vw] w-full px-2">
                
                {/* DAYS */}
                <div className="flex flex-col items-center">
                     <span className="text-[14vw] font-bold text-white leading-none tracking-tight font-sans">
                        {f(timeLeft.days)}
                     </span>
                </div>

                <span className="text-[8vw] font-bold text-gray-600 pb-[1vw]">:</span>

                {/* HOURS */}
                 <div className="flex flex-col items-center">
                     <span className="text-[14vw] font-bold text-white leading-none tracking-tight font-sans">
                        {f(timeLeft.hours)}
                     </span>
                </div>

                <span className="text-[8vw] font-bold text-gray-600 pb-[1vw]">:</span>

                {/* MINUTES */}
                 <div className="flex flex-col items-center">
                     <span className="text-[14vw] font-bold text-white leading-none tracking-tight font-sans">
                        {f(timeLeft.minutes)}
                     </span>
                </div>

                <span className="text-[8vw] font-bold text-gray-600 pb-[1vw]">:</span>

                {/* SECONDS (Gold Highlight) */}
                 <div className="flex flex-col items-center">
                     <span className="text-[14vw] font-bold text-[#ffc107] leading-none tracking-tight font-sans tabular-nums">
                        {f(timeLeft.seconds)}
                     </span>
                </div>
            </div>
            
            {/* Tiny Label at bottom to indicate what this window is (optional, very subtle) */}
            <div className="absolute bottom-2 text-[2vw] text-gray-600 font-bold uppercase tracking-[0.5em] opacity-50">
                Hytale Launch
            </div>
        </div>
    );
  }


  // --- HIGH TECH MODE (For Standard Popup / Fallback) ---
  return (
    <div className="bg-[#0b0e14] w-full h-full flex flex-col relative overflow-hidden select-none font-sans">
      
      {/* 1. Cinematic Background Layers */}
      <div className="absolute inset-0 z-0">
         {/* Deep dark blue/black gradient base */}
         <div className="absolute inset-0 bg-gradient-to-br from-[#0d1016] via-[#13161f] to-[#080a0f]"></div>
         
         {/* Central Glow (Blue) */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,#00bcf2_0%,transparent_60%)] opacity-[0.08] blur-3xl"></div>
         
         {/* Subtle Grid Pattern Overlay */}
         <div className="absolute inset-0 opacity-[0.03]" 
              style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
         </div>
      </div>

      {/* 2. Window Frame (Inner Bezel & Borders) */}
      <div className="absolute inset-0 border-[3px] border-[#151720] z-40 pointer-events-none"></div>
      <div className="absolute inset-[3px] border border-white/5 z-40 pointer-events-none"></div>
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00bcf2]/30 z-40 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00bcf2]/30 z-40 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00bcf2]/30 z-40 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00bcf2]/30 z-40 pointer-events-none"></div>

      {/* 3. Header / Drag Region */}
      <div className="relative z-50 h-10 flex items-center justify-between px-4 bg-[#151720]/80 backdrop-blur-md border-b border-white/5 shadow-md -webkit-app-region-drag">
        {/* Title */}
        <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-3 h-3">
                <div className="absolute inset-0 bg-[#00bcf2] rounded-full opacity-20 animate-ping"></div>
                <div className="relative w-1.5 h-1.5 rounded-full bg-[#00bcf2] shadow-[0_0_8px_#00bcf2]"></div>
            </div>
            <span className="text-[10px] font-display font-bold text-[#e6e6e6] tracking-[0.2em] uppercase pt-0.5">
                {t.hero.title}
            </span>
        </div>

        {/* Actions */}
        <button 
            onClick={onClose} 
            className="group p-1.5 hover:bg-white/5 rounded-md transition-all border border-transparent hover:border-white/10"
            title="Close Window"
        >
          <X size={14} className="text-gray-500 group-hover:text-red-400 transition-colors" />
        </button>
      </div>

      {/* 4. Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        
        {/* Timer Container with Glow */}
        <div className="relative flex flex-col items-center">
            {/* Ambient Glow behind numbers */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#00bcf2] blur-[80px] opacity-[0.05] rounded-full pointer-events-none"></div>
            
            {/* The Timer - Scaled */}
            <div className={`transform transition-transform duration-300 origin-center scale-125`}>
                 <CountdownTimer timeLeft={timeLeft} t={t} />
            </div>
            
            {/* Decorative Label under timer */}
            <div className="mt-6 flex flex-col items-center gap-2 opacity-80">
                <div className="flex items-center gap-3 w-full">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#ffc107]/30"></div>
                    <div className="text-[9px] font-mono text-[#ffc107] font-bold tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        {timeLeft.days === 0 && timeLeft.hours === 0 ? "TARGET REACHED" : "T-MINUS COUNTDOWN"}
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[#ffc107]/30 to-transparent"></div>
                </div>
                
                {/* Simulated Data Points */}
                <div className="flex gap-4 text-[7px] font-mono text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                        <Activity size={8} className="text-[#00bcf2]" />
                        SYNC: STABLE
                    </span>
                    <span>NET: ORBIS-1</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PopupContent;