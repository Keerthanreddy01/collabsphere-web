"use client";

import { useEffect, useRef } from "react";

interface LiquidRevealProps {
  beforeSrc: string; // The base image always visible
  afterSrc: string;  // The image painted by the brush
}

export function LiquidReveal({ beforeSrc, afterSrc }: LiquidRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only run on desktop if not reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const container = containerRef.current;
    const mainCanvas = mainCanvasRef.current;
    if (!container || !mainCanvas) return;

    const mainCtx = mainCanvas.getContext('2d', { willReadFrequently: true });
    if (!mainCtx) return;

    const brushRadius = 143;
    const decay = 0.016;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    let coverCanvas = document.createElement('canvas');
    let coverCtx = coverCanvas.getContext('2d');
    let brushCanvas = document.createElement('canvas');
    let brushCtx = brushCanvas.getContext('2d');
    
    let radius = brushRadius * dpr;
    let diam = Math.ceil(radius * 2);

    let width = 0;
    let height = 0;
    let afterImg = new Image();
    let imgLoaded = false;
    afterImg.crossOrigin = "anonymous";
    afterImg.onload = () => {
      imgLoaded = true;
      resize();
    };
    afterImg.src = afterSrc;

    function resize() {
      if (!container || !mainCanvas || !coverCanvas || !brushCanvas || !imgLoaded) return;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      mainCanvas.width = width * dpr;
      mainCanvas.height = height * dpr;
      
      coverCanvas.width = width * dpr;
      coverCanvas.height = height * dpr;
      
      radius = brushRadius * dpr;
      diam = Math.ceil(radius * 2);
      brushCanvas.width = diam;
      brushCanvas.height = diam;
      
      // draw after image into cover covering the area
      const scale = Math.max(coverCanvas.width / afterImg.width, coverCanvas.height / afterImg.height);
      const iw = afterImg.width * scale;
      const ih = afterImg.height * scale;
      const ix = (coverCanvas.width - iw) / 2;
      const iy = (coverCanvas.height - ih) / 2;
      coverCtx?.drawImage(afterImg, ix, iy, iw, ih);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    let points: {x: number, y: number}[] = [];
    let lastPoint: {x: number, y: number} | null = null;
    let isDrawing = false;
    let idleFrames = 0;
    let rafId: number;

    const onPointerMove = (e: PointerEvent) => {
      const rect = mainCanvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * dpr;
      const y = (e.clientY - rect.top) * dpr;
      
      // If point is far outside, ignore/reset
      if (x < -radius || x > width*dpr + radius || y < -radius || y > height*dpr + radius) {
        lastPoint = null;
        return;
      }

      if (!lastPoint) {
        points.push({x, y});
      } else {
        const dist = Math.hypot(x - lastPoint.x, y - lastPoint.y);
        const step = Math.max(radius * 0.3, 1);
        const n = Math.min(Math.ceil(dist / step), 60);
        for (let i = 1; i <= n; i++) {
          points.push({
            x: lastPoint.x + (x - lastPoint.x) * (i / n),
            y: lastPoint.y + (y - lastPoint.y) * (i / n)
          });
        }
      }
      lastPoint = {x, y};
      isDrawing = true;
    };

    window.addEventListener('pointermove', onPointerMove);

    function tick() {
      if (!mainCtx || !brushCtx || !coverCanvas) return;
      
      if (points.length > 0) {
        idleFrames = 0;
      } else {
        idleFrames++;
        isDrawing = false;
      }

      if (idleFrames <= 120) {
        const fade = isDrawing ? decay : Math.min(decay + idleFrames * 0.004, 0.5);
        mainCtx.globalCompositeOperation = 'destination-out';
        mainCtx.fillStyle = `rgba(0,0,0,${fade})`;
        mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

        if (points.length > 0) {
          mainCtx.globalCompositeOperation = 'source-over';
          
          points.forEach(p => {
            // prepare brush
            brushCtx!.clearRect(0, 0, diam, diam);
            brushCtx!.globalCompositeOperation = 'source-over';
            const grad = brushCtx!.createRadialGradient(radius, radius, 0, radius, radius, radius);
            grad.addColorStop(0, 'rgba(255,255,255,1)');
            grad.addColorStop(0.55, 'rgba(255,255,255,0.82)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            brushCtx!.fillStyle = grad;
            brushCtx!.fillRect(0, 0, diam, diam);
            
            brushCtx!.globalCompositeOperation = 'source-in';
            brushCtx!.drawImage(coverCanvas, p.x - radius, p.y - radius, diam, diam, 0, 0, diam, diam);
            
            mainCtx!.drawImage(brushCanvas, p.x - radius, p.y - radius);
          });
          points = [];
        }
      } else if (idleFrames === 121) {
        // hard clear
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
      }

      rafId = requestAnimationFrame(tick);
    }
    
    rafId = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(rafId);
    };
  }, [afterSrc]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      <img 
        src={beforeSrc} 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover" 
      />
      <canvas 
        ref={mainCanvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
