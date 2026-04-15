'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { FORM_SCHEMAS } from '@/data/form_schemas';
import styles from './visual-editor.module.css';

// Set worker source to local file for stability
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface Props {
  pdfUrl: string;
  formType: string;
  initialData: Record<string, string>;
  onDataChange: (data: Record<string, string>) => void;
}

export default function PDFVisualEditor({ pdfUrl, formType, initialData, onDataChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const schema = FORM_SCHEMAS[formType] || FORM_SCHEMAS['default'];

  useEffect(() => {
    let currentRenderTask: pdfjs.RenderTask | null = null;
    let isCancelled = false;

    async function renderPDF() {
      try {
        setLoading(true);
        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        if (isCancelled) return;

        const page = await pdf.getPage(1);
        if (isCancelled) return;
        
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const textLayerDiv = document.getElementById('text-layer');
        if (!canvas || !textLayerDiv) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        setDimensions({ width: viewport.width, height: viewport.height });

        // Reset text layer
        textLayerDiv.innerHTML = '';
        textLayerDiv.style.width = `${viewport.width}px`;
        textLayerDiv.style.height = `${viewport.height}px`;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        };
        
        currentRenderTask = page.render(renderContext);
        await currentRenderTask.promise;

        // Render text layer (v5 approach)
        const textContent = await page.getTextContent();
        const textLayer = new pdfjs.TextLayer({
          textContentSource: textContent,
          container: textLayerDiv,
          viewport: viewport,
        });
        await textLayer.render();
        
        if (!isCancelled) setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'RenderingCancelledException' && !isCancelled) {
          console.error('PDF Render Error:', err);
        }
        if (!isCancelled) setLoading(false);
      }
    }

    renderPDF();

    return () => {
      isCancelled = true;
      if (currentRenderTask) {
        currentRenderTask.cancel();
      }
    };
  }, [pdfUrl]);

  // Coordinate Mapping for Visual Overlays (based on the drawing logic)
  const getFieldStyle = (key: string): React.CSSProperties | null => {
    // These coordinates should match the ones in pdf-service.ts
    // but converted to percentages for responsiveness
    // Standard A4 is 595x842. We use 1.5 scale in preview (892x1263 approx)
    
    interface Coord { x: number, y: number, w: number, h: number }
    const coords: Record<string, Record<string, Coord>> = {
      'Form RHW20': {
        landlordName: { x: 21, y: 32.5, w: 32, h: 2 },
        landlordAddress: { x: 21, y: 34.5, w: 32, h: 6 },
        tenantName: { x: 55, y: 32.5, w: 32, h: 2 },
        tenantAddress: { x: 55, y: 34.5, w: 32, h: 6 },
        dwellingAddress: { x: 21, y: 48.5, w: 70, h: 5 },
        signatureDate: { x: 85, y: 76, w: 10, h: 2 },
      },
      'Form RHW26': {
        headLandlordName: { x: 21, y: 36, w: 35, h: 2 },
        headLandlordAddress: { x: 21, y: 38.5, w: 35, h: 6 },
        contractHolderName: { x: 60, y: 36, w: 30, h: 2 },
        contractHolderAddress: { x: 60, y: 38.5, w: 30, h: 6 },
        subHolderName: { x: 21, y: 52, w: 35, h: 4 },
        dwellingAddress: { x: 60, y: 52, w: 30, h: 4 },
        decisionDate: { x: 80, y: 81, w: 10, h: 2 },
      }
    };

    const formCoords = coords[formType];
    if (!formCoords || !formCoords[key]) return null;

    const c = formCoords[key];
    return {
      left: `${c.x}%`,
      top: `${c.y}%`,
      width: `${c.w}%`,
      height: `${c.h}%`,
      position: 'absolute',
    };
  };

  const handleChange = (key: string, val: string) => {
    onDataChange({ ...initialData, [key]: val });
  };

  return (
    <div className={styles.editorContainer} ref={containerRef}>
      {loading && <div className={styles.loading}>Rendering PDF Editor...</div>}
      
      <div className={styles.viewport}>
        <div className={styles.pdfWrapper} style={{ width: dimensions.width, height: dimensions.height }}>
          <canvas ref={canvasRef} />
          <div id="text-layer" className="textLayer" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.2 }}></div>
          <div className={styles.overlayLayer}>
            {schema.fields.map((field, idx) => {
              const style = getFieldStyle(field.key);
              
              // If not mapped, show in a sidebar or as a floating field at the bottom
              if (!style) {
                 return (
                   <div key={field.key} className={styles.unmappedField} style={{ top: `${85 + (idx * 4)}%` }}>
                     <label>{field.label}:</label>
                     <input 
                       value={initialData[field.key] || ''} 
                       onChange={e => handleChange(field.key, e.target.value)}
                       placeholder={`Set ${field.label}...`}
                     />
                   </div>
                 );
              }

              return (
                <div key={field.key} style={style} className={styles.inputWrap}>
                  {field.type === 'textarea' || style.height! > '3%' ? (
                    <textarea 
                      value={initialData[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      className={styles.pdfInput}
                      placeholder="..."
                    />
                  ) : (
                    <input 
                      type="text"
                      value={initialData[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      className={styles.pdfInput}
                      placeholder="..."
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
