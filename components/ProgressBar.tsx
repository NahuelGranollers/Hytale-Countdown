import React, { useState, useRef, useEffect } from 'react';
import { Translation, MilestoneCategory } from '../types';
import { START_DATE_ISO, TARGET_DATE_ISO, MILESTONES_DATA } from '../constants';

interface ProgressBarProps {
  percentage: number;
  t: Translation;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, t }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [targetZoom, setTargetZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  
  // Interaction Refs
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const velocityRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const lastMoveXRef = useRef(0);
  const inertiaFrameRef = useRef<number>(0);

  const zoomFocus = useRef<number>(percentage); 
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const start = new Date(START_DATE_ISO).getTime();
  const end = new Date(TARGET_DATE_ISO).getTime();
  const total = end - start;

  const yearMarkers: number[] = [];
  const monthMarkers: { ts: number; label: string }[] = [];
  
  const startDate = new Date(START_DATE_ISO);
  const endDate = new Date(TARGET_DATE_ISO);
  const startYear = startDate.getFullYear() + 1; 
  const endYear = endDate.getFullYear();

  for (let y = startYear; y <= endYear; y++) {
    yearMarkers.push(new Date(`${y}-01-01T00:00:00Z`).getTime());
  }

  if (targetZoom > 3) {
      let current = new Date(startYear - 1, startDate.getMonth(), 1); 
      while (current.getTime() < end) {
          if (current.getTime() > start) {
             const m = current.getMonth();
             if (m !== 0) {
                 const monthName = current.toLocaleDateString(undefined, { month: 'short' });
                 monthMarkers.push({ ts: current.getTime(), label: monthName });
             }
          }
          current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
      }
  }

  const getPosition = (dateStr: string | number) => {
    const current = typeof dateStr === 'number' ? dateStr : new Date(dateStr).getTime();
    return Math.max(0, Math.min(100, ((current - start) / total) * 100));
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Stop inertia on zoom interaction
    cancelAnimationFrame(inertiaFrameRef.current);
    velocityRef.current = 0;

    const isHorizontalSwipe = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (isHorizontalSwipe) return; 

    if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const centerPx = container.scrollLeft + container.clientWidth / 2;
        const currentPct = (centerPx / container.scrollWidth) * 100;
        zoomFocus.current = currentPct;
    }

    const delta = -e.deltaY;
    setTargetZoom(prev => {
        const scaleFactor = delta > 0 ? 1.25 : 0.8; // Slightly more responsive steps
        let newZoom = prev * scaleFactor;
        newZoom = Math.min(80, Math.max(1, newZoom));
        if (newZoom < 1.1) newZoom = 1;
        return newZoom;
    });
  };

  // Zoom Animation Loop
  useEffect(() => {
    if (Math.abs(zoomLevel - targetZoom) < 0.001) return;
    let animationFrameId: number;
    const animate = () => {
      setZoomLevel(prev => {
        const diff = targetZoom - prev;
        if (Math.abs(diff) < 0.01) return targetZoom; 
        // Smoother interpolation factor (0.12)
        return prev + diff * 0.12; 
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetZoom, zoomLevel]);

  // Adjust scroll position to keep focus centered during zoom
  useEffect(() => {
    if (scrollContainerRef.current && zoomLevel > 1) {
        const container = scrollContainerRef.current;
        const pct = zoomFocus.current; 
        if (container.scrollWidth > container.clientWidth) {
            const pointPosition = container.scrollWidth * (pct / 100);
            const viewportCenter = container.clientWidth / 2;
            const targetScroll = pointPosition - viewportCenter;
            
            // Only adjust scroll if we are actively zooming (target != current)
            // or if we just started zooming from 1
            if (Math.abs(zoomLevel - targetZoom) > 0.01 || zoomLevel < 1.1) {
              container.scrollLeft = targetScroll;
            }
        }
    } else if (scrollContainerRef.current && zoomLevel <= 1.05) {
         scrollContainerRef.current.scrollLeft = 0;
    }
  }, [zoomLevel, targetZoom]); 

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1.05) return; 
    
    // Kill inertia
    cancelAnimationFrame(inertiaFrameRef.current);
    velocityRef.current = 0;

    setIsDragging(true);
    startX.current = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    scrollLeftStart.current = scrollContainerRef.current?.scrollLeft || 0;
    
    // Init velocity tracking
    lastMoveXRef.current = e.pageX;
    lastMoveTimeRef.current = performance.now();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5; // Drag sensitivity
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeftStart.current - walk;
    }

    // Velocity Calculation
    const now = performance.now();
    const dt = now - lastMoveTimeRef.current;
    const dx = e.pageX - lastMoveXRef.current;

    if (dt > 0) {
        const newVel = dx / dt;
        // Low-pass filter (0.6/0.4) to smooth out jittery mouse inputs
        velocityRef.current = newVel * 0.6 + velocityRef.current * 0.4;
    }

    lastMoveXRef.current = e.pageX;
    lastMoveTimeRef.current = now;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    // Inertia Loop
    const friction = 0.95;
    const runInertia = () => {
        if (Math.abs(velocityRef.current) < 0.05) {
            velocityRef.current = 0;
            return;
        }

        if (scrollContainerRef.current) {
             // -velocity because dragging right (positive) reduces scrollLeft
            scrollContainerRef.current.scrollLeft -= velocityRef.current * 14; 
        }

        velocityRef.current *= friction;
        inertiaFrameRef.current = requestAnimationFrame(runInertia);
    };
    
    cancelAnimationFrame(inertiaFrameRef.current);
    inertiaFrameRef.current = requestAnimationFrame(runInertia);
  };

  const handleMouseLeave = () => {
    if (isDragging) handleMouseUp();
  };

  const getCategoryStyles = (type: MilestoneCategory, isPast: boolean) => {
    const baseColors = {
      announcement: 'bg-[#00bcf2] border-[#00bcf2]',
      development: 'bg-[#4caf50] border-[#4caf50]',
      technical: 'bg-[#9c27b0] border-[#9c27b0]',
      community: 'bg-[#ffc107] border-[#ffc107]',
      blog: 'bg-[#607d8b] border-[#607d8b]'
    };

    if (isPast) {
       return `${baseColors[type]} shadow-[0_0_10px_rgba(0,0,0,0.3)]`;
    } else {
       return `bg-white dark:bg-[#1c2333] ${baseColors[type].replace('bg-', 'border-')}`;
    }
  };

  const getCategoryLabel = (type: MilestoneCategory) => t.categories[type];

  const CATEGORIES: { type: MilestoneCategory; color: string }[] = [
    { type: 'announcement', color: 'bg-[#00bcf2]' },
    { type: 'development', color: 'bg-[#4caf50]' },
    { type: 'technical', color: 'bg-[#9c27b0]' },
    { type: 'community', color: 'bg-[#ffc107]' },
    { type: 'blog', color: 'bg-[#607d8b]' },
  ];

  return (
    <div className="w-full px-2 md:px-8 select-none flex flex-col gap-1 md:gap-2">
      
      {/* Legend - Compact */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-1 md:gap-3 max-w-7xl mx-auto w-full">
         <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 md:gap-4 px-2">
             {CATEGORIES.map((cat) => (
                <div key={cat.type} className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity cursor-help">
                    <div className={`w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full ${cat.color} shadow-sm border border-white/20`}></div>
                    <span className="text-[7px] md:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-none">
                        {getCategoryLabel(cat.type)}
                    </span>
                </div>
             ))}
         </div>
      </div>

      {/* Scroll Container */}
      <div 
        ref={scrollContainerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`
            relative w-full h-[15vh] min-h-[80px] max-h-[160px] rounded-xl md:rounded-2xl overflow-y-hidden border border-gray-200 dark:border-white/5 shadow-inner transition-colors duration-300
            ${zoomLevel > 1.01 
                ? 'overflow-x-auto cursor-grab active:cursor-grabbing bg-gray-50 dark:bg-[#0b0e14] touch-pan-x' 
                : 'overflow-x-hidden bg-gray-100/50 dark:bg-[#0d1016]'
            }
        `}
      >
          {/* Inner Content Wrapper - Expands with Zoom */}
          <div 
            className="h-full relative will-change-transform"
            style={{ 
                width: `${zoomLevel * 100}%`,
                minWidth: '100%',
                // Use transform-origin left for cleaner scaling if we used scale, but we use width. 
                // Width change is layout triggering, but unavoidable for scrollWidth logic unless we rewrite to pure transform.
                // Keeping width is safer for scrolling mechanics.
            }}
          >
            {/* The Timeline Line */}
            <div className="absolute top-1/2 left-4 right-4 md:left-12 md:right-12 h-1.5 md:h-2.5 bg-gray-300 dark:bg-[#1f2937] rounded-full shadow-inner -translate-y-1/2">
                
                {/* 1. Year Markers */}
                {yearMarkers.map((ts, idx) => {
                   const pos = getPosition(ts);
                   return (
                       <div key={`year-${idx}`} className="absolute top-1/2 left-0 -translate-y-1/2 flex flex-col items-center pointer-events-none" style={{ left: `${pos}%`, transform: 'translateX(-50%) translateY(-50%)' }}>
                           <div className="h-6 md:h-12 w-[1px] md:w-[2px] bg-gray-400 dark:bg-gray-600/50"></div>
                           <div className="mt-4 md:mt-8 text-[9px] md:text-xs font-display font-bold text-gray-400 dark:text-gray-500">{new Date(ts).getFullYear()}</div>
                       </div>
                   )
                })}

                {/* 2. Month Markers */}
                {monthMarkers.map((m, idx) => {
                   const pos = getPosition(m.ts);
                   const opacity = Math.max(0, Math.min(1, (zoomLevel - 3) / 2));
                   if (opacity <= 0) return null;

                   return (
                       <div key={`month-${idx}`} className="absolute top-1/2 left-0 -translate-y-1/2 flex flex-col items-center pointer-events-none" style={{ left: `${pos}%`, transform: 'translateX(-50%) translateY(-50%)', opacity }}>
                           <div className="h-3 md:h-6 w-[1px] bg-gray-300 dark:bg-gray-700"></div>
                           <div className="mt-2 md:mt-4 text-[7px] md:text-[9px] font-mono text-gray-400 dark:text-gray-600 uppercase tracking-widest">{m.label}</div>
                       </div>
                   )
                })}

                {/* 3. Milestones */}
                {MILESTONES_DATA.map((m, idx) => {
                  const pos = getPosition(m.date);
                  const isPast = pos <= percentage;
                  const isMajor = !!m.major;
                  
                  let opacity = 1;
                  let scale = 1;
                  let pointerEvents: 'auto' | 'none' = 'auto';

                  if (!isMajor) {
                      opacity = Math.max(0, Math.min(1, (zoomLevel - 1.1) / 1.5));
                      scale = Math.max(0, Math.min(1, (zoomLevel - 1) / 1.5)); 
                      if (opacity < 0.1) pointerEvents = 'none';
                  }

                  const sizeClass = isMajor ? 'w-4 h-4 md:w-6 md:h-6 border-2' : 'w-2.5 h-2.5 md:w-3 md:h-3 border-[1.5px]';
                  const zIndex = isMajor ? 'z-30' : 'z-20';
                  const colorStyle = getCategoryStyles(m.type, isPast);
                  const showLabel = (isMajor && zoomLevel > 1.5) || zoomLevel > 6;
                  const isTop = idx % 2 === 0;

                  return (
                    <div 
                      key={idx}
                      className={`absolute top-1/2 ${zIndex} will-change-transform`}
                      style={{ 
                          left: `${pos}%`,
                          opacity: opacity,
                          transform: `translate(-50%, -50%) scale(${scale})`,
                          pointerEvents: pointerEvents
                      }}
                    >
                      <a 
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group relative flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${sizeClass} ${colorStyle} hover:scale-125`}
                        onMouseDown={(e) => e.stopPropagation()} 
                      >
                        {/* Hover Tooltip */}
                        {!showLabel && (
                            <div className="hidden md:flex absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white dark:bg-[#151720] px-3 py-1.5 rounded shadow-xl border border-gray-100 dark:border-white/10 pointer-events-none transform translate-y-2 group-hover:translate-y-0 z-50 flex-col gap-0.5">
                                <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-0.5 mb-0.5">
                                    <span className={`text-[8px] font-bold uppercase tracking-wider ${colorStyle.split(' ')[0].replace('bg-', 'text-')}`}>
                                        {getCategoryLabel(m.type)}
                                    </span>
                                    <span className="text-[8px] text-gray-400 font-mono ml-auto">{m.date}</span>
                                </div>
                                <div className="text-[10px] font-bold text-gray-800 dark:text-gray-100 max-w-[200px] truncate">
                                    {m.title}
                                </div>
                            </div>
                        )}
                      </a>

                      {/* Permanent Label (Zoomed View) */}
                      {showLabel && (
                          <div 
                            className={`absolute left-1/2 -translate-x-1/2 w-28 md:w-40 flex flex-col items-center pointer-events-none transition-all duration-500
                                 ${isTop ? 'bottom-full mb-1.5 md:mb-2' : 'top-full mt-1.5 md:mt-2'}
                            `}
                          >
                             <div className={`w-[1px] bg-gray-400/50 absolute left-1/2 -translate-x-1/2 ${isTop ? 'top-full h-1.5 md:h-2' : 'bottom-full h-1.5 md:h-2'}`}></div>

                             <div className={`bg-white/90 dark:bg-[#151720]/80 backdrop-blur-md px-2 py-0.5 md:px-2 md:py-1 rounded-lg border border-gray-200 dark:border-white/10 shadow-xl text-center ${isTop ? 'mb-0.5' : 'mt-0.5'}`}>
                                <div className="flex items-center justify-center gap-1 mb-0.5">
                                    <span className={`w-1 h-1 rounded-full ${colorStyle.split(' ')[0]}`}></span>
                                    <span className="text-[6px] md:text-[8px] font-bold uppercase text-gray-500">{getCategoryLabel(m.type)}</span>
                                </div>
                                <span className="block text-[7px] md:text-[10px] font-bold text-gray-800 dark:text-gray-100 leading-tight truncate max-w-full">{m.title}</span>
                             </div>
                          </div>
                      )}
                    </div>
                  );
                })}

                {/* Active Progress Fill */}
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00bcf2]/20 via-[#00bcf2] to-[#00bcf2] rounded-full z-10 opacity-90 shadow-[0_0_15px_rgba(0,188,242,0.5)]"
                  style={{ width: `${percentage}%` }}
                >
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2.5 h-2.5 md:w-4 md:h-4 bg-white rounded-full shadow-[0_0_10px_2px_#00bcf2] border-2 border-[#00bcf2]"></div>
                </div>

            </div>
          </div>
      </div>
      
    </div>
  );
};

export default ProgressBar;