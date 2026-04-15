'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface Props { pdfUrl: string; }

export default function PDFPreview({ pdfUrl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let renderTask: pdfjs.RenderTask | null = null;

    async function render() {
      try {
        setLoading(true);
        setError(false);
        const pdf = await pdfjs.getDocument(pdfUrl).promise;
        if (cancelled) return;
        const page = await pdf.getPage(1);
        if (cancelled) return;

        const viewport = page.getViewport({ scale: 1.2 });
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const context = canvas.getContext('2d')!;
        const task = page.render({ canvasContext: context, viewport });
        renderTask = task;
        await task.promise;
        if (!cancelled) setLoading(false);
      } catch (err: unknown) {
        if (!cancelled && err instanceof Error && err.name !== 'RenderingCancelledException') {
          setError(true);
          setLoading(false);
        }
      }
    }

    render();
    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pdfUrl]);

  if (error) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
        PDF preview unavailable
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', lineHeight: 0, backgroundColor: '#f1f5f9' }}>
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          minHeight: 200, background: '#f8fafc',
        }}>
          <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading preview…</span>
        </div>
      )}
      <canvas ref={canvasRef} style={{ width: '100%', display: 'block' }} />
    </div>
  );
}
