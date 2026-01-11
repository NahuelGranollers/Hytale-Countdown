import React, { useState, useEffect, useRef } from 'react';
import { X, GripHorizontal, Maximize2 } from 'lucide-react';
import { CountDownTime, Translation } from '../types';

interface FloatingWidgetProps {
  timeLeft: CountDownTime;
  t: Translation;
}

const FloatingWidget: React.FC<FloatingWidgetProps> = ({ timeLeft, t }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  // Position state: null means default CSS position (bottom-right)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isClosed = localStorage.getItem('hytale_widget_closed');
    if (isClosed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem('hytale_widget_closed', 'true');
  };

  const handleRestore = () => {
    setIsVisible(true);
    localStorage.removeItem('hytale_widget_closed');
  };

  // --- Drag Logic ---
  
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!widgetRef.current) return;
    
    // Prevent dragging if clicking close button
    if ((e.target as HTMLElement).closest('.close-btn')) return;

    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const rect = widgetRef.current.getBoundingClientRect();
    
    // Calculate offset from the top-left corner of the widget
    dragStartRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !dragStartRef.current) return;
      e.preventDefault(); // Prevent scrolling on mobile while dragging

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      // Calculate new position
      let newX = clientX - dragStartRef.current.x;
      let newY = clientY - dragStartRef.current.y;

      // Boundary checks
      const maxX = window.innerWidth - (widgetRef.current?.offsetWidth || 200);
      const maxY = window.innerHeight - (widgetRef.current?.offsetHeight || 100);

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove, { passive: false });
      window.addEventListener('touchend', handlePointerUp);
    }

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging]);


  if (!isVisible) {
      // Optional: A tiny trigger to bring it back if needed, or just keep it hidden per requirements.
      // For UX, often good to have a way to restore. Adding a tiny trigger bottom left.
      return (
          <button 
            onClick={handleRestore}
            className="fixed bottom-4 left-4 z-[9999] p-2 bg-[#151720]/80 backdrop-blur-md border border-[#ffc107]/30 rounded-full text-[#ffc107] hover:scale-110 transition-transform shadow-lg"
            title="Show Timer"
          >
              <Maximize2 size={16} />
          </button>
      );
  }

  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <div
      ref={widgetRef}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      style={{
        left: position ? `${position.x}px` : undefined,
        top: position ? `${position.y}px` : undefined,
        // If no position set yet, stick to bottom-right
        bottom: position ? undefined : '1.5rem', 
        right: position ? undefined : '1.5rem',
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none' // Important for mobile drag
      }}
      className={`
        fixed z-[9999] w-auto min-w-[240px] select-none
        bg-[#0d1016]/85 backdrop-blur-xl
        border border-[#ffc107]/20 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.5)]
        transition-shadow duration-300
        ${isDragging ? 'scale-105 shadow-[0_8px_30px_rgba(0,188,242,0.3)]' : 'hover:shadow-[0_4px_25px_rgba(0,0,0,0.6)]'}
        overflow-hidden animate-fade-in-down
      `}
    >
      {/* Header / Drag Handle */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#151720] to-[#1a1d26] border-b border-white/5">
         <div className="flex items-center gap-2 text-gray-400">
            <GripHorizontal size={14} />
            <span className="text-[9px] font-display font-bold tracking-widest uppercase text-[#00bcf2]">Hytale Launch</span>
         </div>
         <button 
            onClick={handleClose}
            className="close-btn text-gray-400 hover:text-red-400 transition-colors p-0.5 rounded hover:bg-white/5"
         >
            <X size={14} />
         </button>
      </div>

      {/* Content */}
      <div className="px-4 py-3 flex items-center justify-center gap-3">
         <div className="flex flex-col items-center">
            <span className="font-mono text-xl md:text-2xl font-bold text-white drop-shadow-md">{format(timeLeft.days)}</span>
            <span className="text-[8px] text-[#ffc107] font-bold uppercase tracking-wider">{t.time.days.substring(0, 1)}</span>
         </div>
         <span className="text-gray-600 font-bold mb-3">:</span>
         <div className="flex flex-col items-center">
            <span className="font-mono text-xl md:text-2xl font-bold text-white drop-shadow-md">{format(timeLeft.hours)}</span>
            <span className="text-[8px] text-[#ffc107] font-bold uppercase tracking-wider">{t.time.hours.substring(0, 1)}</span>
         </div>
         <span className="text-gray-600 font-bold mb-3">:</span>
         <div className="flex flex-col items-center">
            <span className="font-mono text-xl md:text-2xl font-bold text-white drop-shadow-md">{format(timeLeft.minutes)}</span>
            <span className="text-[8px] text-[#ffc107] font-bold uppercase tracking-wider">{t.time.minutes.substring(0, 1)}</span>
         </div>
         <span className="text-gray-600 font-bold mb-3">:</span>
         <div className="flex flex-col items-center">
            <span className="font-mono text-xl md:text-2xl font-bold text-white drop-shadow-md w-8 text-center">{format(timeLeft.seconds)}</span>
            <span className="text-[8px] text-[#ffc107] font-bold uppercase tracking-wider">{t.time.seconds.substring(0, 1)}</span>
         </div>
      </div>
      
      {/* Decorative Bottom Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#ffc107]/50 to-transparent"></div>
    </div>
  );
};

export default FloatingWidget;