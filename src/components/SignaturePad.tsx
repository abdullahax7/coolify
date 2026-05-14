'use client';

import React, { useRef, useState, useEffect } from 'react';

interface SignaturePadProps {
  value: string; // base64 string
  onChange: (value: string) => void;
  width?: number;
  height?: number;
  placeholder?: string;
}

export default function SignaturePad({ 
  value, 
  onChange, 
  width = 400, 
  height = 200,
  placeholder = "Draw your signature here..." 
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize canvas and handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Line style
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // If we have an existing value, draw it
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = value;
    }
  }, [width, height]);

  // Redraw if value changes from outside (e.g. form reset)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!value) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [value]);

  const getPointerPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPointerPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPointerPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    save();
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Only save if canvas is not empty (simplified check)
    const dataUrl = canvas.toDataURL('image/png');
    onChange(dataUrl);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: width }}>
      <div 
        ref={containerRef}
        style={{ 
          position: 'relative', 
          border: '2px solid #e2e8f0', 
          borderRadius: 16, 
          background: '#fff',
          cursor: 'crosshair',
          touchAction: 'none',
          overflow: 'hidden'
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
        
        {!value && !isDrawing && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#94a3b8',
            fontSize: '0.875rem',
            pointerEvents: 'none',
            fontWeight: 500
          }}>
            {placeholder}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={clear}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 6,
            textDecoration: 'underline'
          }}
          onMouseOver={e => e.currentTarget.style.color = '#e11d48'}
          onMouseOut={e => e.currentTarget.style.color = '#64748b'}
        >
          Clear Signature
        </button>
      </div>
    </div>
  );
}
