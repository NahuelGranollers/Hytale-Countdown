import { useEffect } from 'react';
import { CountDownTime } from '../types';

interface UseDynamicFaviconProps {
  timeLeft: CountDownTime;
  progress: number;
}

const useDynamicFavicon = ({ timeLeft, progress }: UseDynamicFaviconProps) => {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // --- Configuration ---
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 30; 
    
    // Hytale Colors
    const colorBg = '#0d1016'; // Darker bg for contrast
    const colorText = '#ffffff'; // High contrast white
    const colorAlert = '#ffc107'; // Gold

    // 1. Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Background (Circle) - Maximized
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = colorBg;
    ctx.fill();
    
    // Optional: Subtle border to distinguish from browser tab color
    ctx.lineWidth = 2;
    ctx.strokeStyle = timeLeft.days < 1 ? colorAlert : '#00bcf2';
    ctx.stroke();

    // 3. Draw Text (MASSIVE Digits)
    ctx.fillStyle = colorText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Logic for text display
    let textToDraw = timeLeft.days.toString();
    let fontSize = 42;
    
    if (timeLeft.days > 999) {
        textToDraw = "999";
        fontSize = 28;
    } else if (timeLeft.days > 99) {
        fontSize = 34; // 3 digits
    } else if (timeLeft.days === 0) {
        // Less than 1 day
        if (timeLeft.hours > 0) {
             textToDraw = `${timeLeft.hours}h`;
             fontSize = 32;
             ctx.fillStyle = colorAlert;
        } else {
             textToDraw = "!";
             fontSize = 52;
             ctx.fillStyle = colorAlert;
        }
    } else {
        // Standard 1 or 2 digits -> Make it HUGE
        fontSize = 48;
    }

    // Use a very heavy font stack
    ctx.font = `900 ${fontSize}px "Arial Black", "Roboto Black", "Impact", sans-serif`;
    
    // Slight shadow for legibility
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 4;

    // Optical vertical alignment adjustments based on font
    const yOffset = fontSize > 40 ? 4 : 2; 
    ctx.fillText(textToDraw, centerX, centerY + yOffset);

    // 4. Update Favicon Link
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = canvas.toDataURL('image/png');
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = canvas.toDataURL('image/png');
      document.head.appendChild(newLink);
    }

  }, [timeLeft.days, timeLeft.hours]); 
};

export default useDynamicFavicon;