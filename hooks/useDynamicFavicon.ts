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
    const radius = 26; // Leave space for stroke
    const lineWidth = 6;
    
    // Hytale Colors
    const colorBg = '#151720';
    const colorRingBase = '#2c3e50';
    const colorRingProgress = timeLeft.days === 0 ? '#ffc107' : '#00bcf2'; // Gold if < 24h, else Blue
    const colorText = '#ffffff';

    // 1. Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Background Circle (Dark)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + lineWidth/2, 0, 2 * Math.PI);
    ctx.fillStyle = colorBg;
    ctx.fill();

    // 3. Draw Ring Background (Dimmed)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = colorRingBase;
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // 4. Draw Progress Ring
    // Start from top (-Math.PI/2)
    const startAngle = -Math.PI / 2;
    // Calculate end angle based on progress (0 to 100)
    const endAngle = startAngle + (Math.PI * 2 * (progress / 100));

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.strokeStyle = colorRingProgress;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 5. Draw Text (Days Left)
    ctx.fillStyle = colorText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Logic for text display
    let textToDraw = timeLeft.days.toString();
    
    if (timeLeft.days > 999) {
        ctx.font = 'bold 18px "Open Sans", sans-serif';
        textToDraw = "999+";
    } else if (timeLeft.days > 99) {
        ctx.font = 'bold 20px "Open Sans", sans-serif';
    } else if (timeLeft.days > 0) {
        ctx.font = 'bold 26px "Open Sans", sans-serif';
    } else {
        // Less than 1 day
        if (timeLeft.hours > 0) {
             ctx.font = 'bold 24px "Open Sans", sans-serif';
             textToDraw = `${timeLeft.hours}h`;
        } else {
             ctx.font = 'bold 32px "Open Sans", sans-serif';
             textToDraw = "!";
        }
    }

    ctx.fillText(textToDraw, centerX, centerY + 2); // +2 for optical alignment

    // 6. Update Favicon Link
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = canvas.toDataURL('image/png');
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = canvas.toDataURL('image/png');
      document.head.appendChild(newLink);
    }

  }, [timeLeft.days, timeLeft.hours, progress]); // Only update when meaningful data changes
};

export default useDynamicFavicon;