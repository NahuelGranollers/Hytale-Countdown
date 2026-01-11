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

    // Strategy 1: Document Picture-in-Picture API (True "Always on Top" + No URL)
    // We must check if we are in the top-level window, as PiP is blocked in iframes.
    const isTopLevel = window.self === window.top;

    // @ts-ignore - Types might not be fully available in all TS environments yet
    if (isTopLevel && 'documentPictureInPicture' in window) {
        try {
            // @ts-ignore
            const pip = await window.documentPictureInPicture.requestWindow({
                width: 380,
                height: 200,
            });

            // Copy all styles from the main window to the PiP window
            [...document.head.querySelectorAll('style, link[rel="stylesheet"]')].forEach((style) => {
                pip.document.head.appendChild(style.cloneNode(true));
            });

            // Handle PiP closing
            pip.addEventListener('pagehide', () => {
                setPipWindow(null);
            });

            setPipWindow(pip);
            return; // Success
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


  // If not visible button
  if (!isVisible) {
      return (
          <>
            <button 
                onClick={handleRestore}
                className="fixed bottom-4 left-4 z-[9999] p-2 bg-[#151720]/80 backdrop-blur-md border border-[#ffc107]/30 rounded-full text-[#ffc107] hover:scale-110 transition-transform shadow-lg"
                title="Show Timer"
            >
                <Maximize2 size={16} />
            </button>
            {/* If PiP is active, we still render the content via portal even if main widget is hidden/minimized */}
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
            bottom: position ? undefined : '1.5rem', 
            right: position ? undefined : '1.5rem',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none'
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
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#151720] to-[#1a1d26] border-b border-white/5">
            <div className="flex items-center gap-2 text-gray-400">
                <GripHorizontal size={14} />
                <span className="text-[9px] font-display font-bold tracking-widest uppercase text-[#00bcf2]">
                    {pipWindow ? 'External Window' : 'Hytale Launch'}
                </span>
            </div>
            <div className="flex items-center gap-1">
                <button 
                    onClick={openPopup}
                    className="text-gray-400 hover:text-[#00bcf2] transition-colors p-0.5 rounded hover:bg-white/5"
                    title={pipWindow ? "Focus Window" : "Popout Window"}
                >
                    <ExternalLink size={12} />
                </button>
                <button 
                    onClick={handleClose}
                    className="close-btn text-gray-400 hover:text-red-400 transition-colors p-0.5 rounded hover:bg-white/5"
                >
                    <X size={14} />
                </button>
            </div>
        </div>

        {/* Local Widget Content */}
        {!pipWindow ? (
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
        ) : (
             <div className="px-4 py-6 text-center">
                 <p className="text-[#00bcf2] text-xs font-bold uppercase tracking-wider animate-pulse">Running in External Window</p>
             </div>
        )}
        
        {/* Decorative Bottom Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#ffc107]/50 to-transparent"></div>
        </div>

        {/* Portal to PiP Window */}
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