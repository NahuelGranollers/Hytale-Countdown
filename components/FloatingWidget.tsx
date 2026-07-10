import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, GripHorizontal, Maximize2, ExternalLink } from 'lucide-react';
import { CountDownTime, Translation } from '../types';
import PopupContent from './PopupContent';

interface FloatingWidgetProps {
  timeLeft: CountDownTime;
  t: Translation;
  lang: string;
}

const FloatingWidget: React.FC<FloatingWidgetProps> = ({ timeLeft, t, lang }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  
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
    // Close pip if open
    if (pipWindow) pipWindow.close();
  };

  const handleRestore = () => {
    setIsVisible(true);
    localStorage.removeItem('hytale_widget_closed');
  };

  const openPopup = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Strategy 1: Document Picture-in-Picture API
    const isTopLevel = window.self === window.top;

    // @ts-ignore
    if (isTopLevel && 'documentPictureInPicture' in window) {
        try {
            // @ts-ignore
            const pip = await window.documentPictureInPicture.requestWindow({
                width: 380,
                height: 180,
            });

            [...document.head.querySelectorAll('style, link[rel="stylesheet"]')].forEach((style) => {
                pip.document.head.appendChild(style.cloneNode(true));
            });

            pip.addEventListener('pagehide', () => {
                setPipWindow(null);
            });

            setPipWindow(pip);
            return;
        } catch (error) {
            console.error('PiP failed, falling back to window.open', error);
        }
    }

    // Strategy 2: Fallback to standard popup
    const url = `${window.location.origin}${window.location.pathname}?mode=popup&lang=${lang}`;
    const features = 'width=380,height=200,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=no,alwaysRaised=yes,top=100,left=100';
    window.open(url, 'HytaleTimerPopup', features);
  };

  // --- Drag Logic ---
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!widgetRef.current) return;
    if ((e.target as HTMLElement).closest('button')) return;

    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const rect = widgetRef.current.getBoundingClientRect();
    dragStartRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !dragStartRef.current) return;
      e.preventDefault();

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      let newX = clientX - dragStartRef.current.x;
      let newY = clientY - dragStartRef.current.y;

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
      return (
          <>
            <button 
                onClick={handleRestore}
                className="fixed bottom-4 left-4 z-[9999] p-3 bg-[#151720] border border-white/10 rounded-full text-[#00bcf2] hover:scale-110 transition-transform shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                title="Show Timer"
            >
                <Maximize2 size={20} />
            </button>
            {pipWindow && createPortal(
                <PopupContent 
                    timeLeft={timeLeft} 
                    t={t} 
                    onClose={() => pipWindow.close()} 
                    isPip={true}
                />, 
                pipWindow.document.body
            )}
          </>
      );
  }

  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <>
        <div
        ref={widgetRef}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        style={{
            left: position ? `${position.x}px` : undefined,
            top: position ? `${position.y}px` : undefined,
            bottom: position ? undefined : '2rem', 
            right: position ? undefined : '2rem',
            touchAction: 'none'
        }}
        className={`
            fixed z-[9999] w-auto min-w-[320px] select-none
            bg-[#0b0e14] 
            border border-[#1f2937] rounded-lg shadow-2xl
            transition-all duration-200
            ${isDragging ? 'cursor-grabbing shadow-[0_0_50px_rgba(0,0,0,0.6)] scale-[1.02]' : 'cursor-grab hover:shadow-[0_0_30px_rgba(0,0,0,0.4)]'}
            overflow-hidden animate-fade-in-down
        `}
        >
        {/* Header - Dark grey background, cyan text */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#151720] border-b border-white/5">
            <div className="flex items-center gap-3">
                {/* 2x3 Grid Dots Simulation using Lucide */}
                <GripHorizontal size={18} className="text-gray-500 opacity-60" />
                <span className="font-display font-bold text-[11px] tracking-[0.2em] text-[#00bcf2] uppercase pt-0.5">
                    {pipWindow ? 'EXTERNAL WINDOW' : 'HYTALE LAUNCH'}
                </span>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={openPopup}
                    className="text-gray-500 hover:text-[#00bcf2] transition-colors"
                    title={pipWindow ? "Focus Window" : "Popout Window"}
                >
                    <ExternalLink size={16} />
                </button>
                <button 
                    onClick={handleClose}
                    className="text-gray-500 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
        </div>

        {/* Content - Pitch dark background, white text, yellow labels */}
        {!pipWindow ? (
            <div className="px-6 py-5 bg-[#080a0f]">
                <div className="flex items-start justify-center gap-4">
                    {/* Days */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="font-sans font-bold text-3xl md:text-4xl text-white leading-none tracking-wide drop-shadow-sm">{format(timeLeft.days)}</span>
                        <span className="font-bold text-[10px] text-[#ffc107] uppercase leading-none">{t.time.days.substring(0, 1)}</span>
                    </div>

                    <div className="text-gray-700 font-bold text-2xl leading-none mt-1 opacity-50">:</div>

                    {/* Hours */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="font-sans font-bold text-3xl md:text-4xl text-white leading-none tracking-wide drop-shadow-sm">{format(timeLeft.hours)}</span>
                        <span className="font-bold text-[10px] text-[#ffc107] uppercase leading-none">{t.time.hours.substring(0, 1)}</span>
                    </div>

                    <div className="text-gray-700 font-bold text-2xl leading-none mt-1 opacity-50">:</div>

                    {/* Minutes */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="font-sans font-bold text-3xl md:text-4xl text-white leading-none tracking-wide drop-shadow-sm">{format(timeLeft.minutes)}</span>
                        <span className="font-bold text-[10px] text-[#ffc107] uppercase leading-none">{t.time.minutes.substring(0, 1)}</span>
                    </div>

                    <div className="text-gray-700 font-bold text-2xl leading-none mt-1 opacity-50">:</div>

                    {/* Seconds */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="font-sans font-bold text-3xl md:text-4xl text-white leading-none tracking-wide drop-shadow-sm tabular-nums">{format(timeLeft.seconds)}</span>
                        <span className="font-bold text-[10px] text-[#ffc107] uppercase leading-none">{t.time.seconds.substring(0, 1)}</span>
                    </div>
                </div>
            </div>
        ) : (
             <div className="px-6 py-8 text-center bg-[#080a0f]">
                 <div className="inline-block px-3 py-1 border border-[#00bcf2]/30 rounded text-[#00bcf2] text-[10px] font-bold uppercase tracking-widest animate-pulse">
                    Running Externally
                 </div>
             </div>
        )}
        </div>

        {pipWindow && createPortal(
            <PopupContent 
                timeLeft={timeLeft} 
                t={t} 
                onClose={() => pipWindow.close()} 
                isPip={true}
            />, 
            pipWindow.document.body
        )}
    </>
  );
};

export default FloatingWidget;