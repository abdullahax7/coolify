'use client';

import React, {
  useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle,
} from 'react';

/* ─── types ─────────────────────────────────────────────── */
export interface PDFEditorHandle { exportPDF(): Promise<Uint8Array>; }

type Tool = 'text' | 'sign' | 'tick' | 'cross' | 'erase';

interface Annotation {
  id: string;
  type: 'text' | 'sign' | 'tick' | 'cross';
  pageIndex: number;
  x: number; y: number;
  // text
  value?: string; fontSize?: number; color?: string;
  // sign
  points?: [number, number][];
  strokeColor?: string; strokeWidth?: number;
  // tick / cross
  size?: number;
}

interface AcroField {
  name: string;
  type: 'text' | 'multiline' | 'checkbox' | 'select';
  options?: string[];
  x: number; y: number; w: number; h: number;
}

interface RenderedPage {
  canvas: HTMLCanvasElement;
  width: number; height: number;
  acroFields: AcroField[];
}

interface Props {
  document: string;
  onLoad?: (handle: PDFEditorHandle) => void;
  style?: React.CSSProperties;
}

const SCALE = 1.5;
let _n = 0;
const uid = () => `a${Date.now()}${_n++}`;

/* ═══════════════════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════════════════ */
const PDFEditor = forwardRef<PDFEditorHandle, Props>(function PDFEditor(
  { document: docUrl, onLoad, style }, ref,
) {
  const [pages,   setPages]   = useState<RenderedPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [tool,    setTool]    = useState<Tool>('text');
  const [zoom,    setZoom]    = useState(1);
  const [annotations, setAnnots] = useState<Annotation[]>([]);
  const [selected,    setSelected] = useState<string | null>(null);
  const [color,  setColor]  = useState('#000000');
  const [fSize,  setFSize]  = useState(13);

  const rawBytes   = useRef<Uint8Array | null>(null);
  const acroVals   = useRef<Record<string, string>>({});
  const exportPDFRef = useRef<(() => Promise<Uint8Array>) | null>(null);
  const drawing = useRef<string | null>(null);
  const annPress = useRef<{
    id: string;
    clientX: number; clientY: number;
    origX: number; origY: number;
    origPoints?: [number,number][];
    dragging: boolean;
  } | null>(null);
  const DRAG_THRESHOLD = 4;

  /* ── exportPDF ── */
  const exportPDF = useCallback(async (): Promise<Uint8Array> => {
    if (!rawBytes.current) throw new Error('not loaded');
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
    const doc   = await PDFDocument.load(rawBytes.current);
    const font  = await doc.embedFont(StandardFonts.Helvetica);
    const pages = doc.getPages();

    // AcroForm
    try {
      const form = doc.getForm();
      const { PDFTextField, PDFCheckBox, PDFDropdown } = await import('pdf-lib');
      for (const [name, val] of Object.entries(acroVals.current)) {
        if (!val) continue;
        try {
          const f = form.getField(name);
          if (f instanceof PDFTextField)  f.setText(val);
          else if (f instanceof PDFCheckBox) {
            if (val === 'true') f.check(); else f.uncheck();
          }
          else if (f instanceof PDFDropdown) f.select(val);
        } catch { /* */ }
      }
      form.flatten();
    } catch { /* no form */ }

    const toRgb = (hex: string) =>
      rgb(parseInt(hex.slice(1,3),16)/255, parseInt(hex.slice(3,5),16)/255, parseInt(hex.slice(5,7),16)/255);

    for (const ann of annotations) {
      const p = pages[ann.pageIndex]; if (!p) continue;
      const { height: pH } = p.getSize();
      const s = 1 / SCALE;

      if (ann.type === 'text' && ann.value) {
        p.drawText(ann.value, {
          x: ann.x * s, y: pH - (ann.y + (ann.fontSize ?? 13)) * s,
          size: (ann.fontSize ?? 13) * s, font, color: toRgb(ann.color ?? '#000000'),
        });
      }
      if (ann.type === 'sign' && ann.points && ann.points.length >= 2) {
        for (let i = 1; i < ann.points.length; i++) {
          const [x1,y1] = ann.points[i-1], [x2,y2] = ann.points[i];
          p.drawLine({
            start: { x: x1*s, y: pH-y1*s }, end: { x: x2*s, y: pH-y2*s },
            thickness: ann.strokeWidth ?? 2, color: toRgb(ann.strokeColor ?? '#000'),
          });
        }
      }
      if (ann.type === 'tick') {
        const sz = (ann.size ?? 28) * s;
        const ax = ann.x * s, ay = ann.y * s;
        const green = rgb(0.086, 0.639, 0.255);
        p.drawLine({ start: { x: ax + sz*0.1, y: pH-(ay+sz*0.55) }, end: { x: ax+sz*0.4, y: pH-(ay+sz*0.85) }, thickness: 2.5, color: green });
        p.drawLine({ start: { x: ax + sz*0.4, y: pH-(ay+sz*0.85) }, end: { x: ax+sz*0.9, y: pH-(ay+sz*0.2) }, thickness: 2.5, color: green });
      }
      if (ann.type === 'cross') {
        const sz = (ann.size ?? 28) * s;
        const ax = ann.x * s, ay = ann.y * s;
        const red = rgb(0.863, 0.196, 0.149);
        p.drawLine({ start: { x: ax+sz*0.15, y: pH-(ay+sz*0.15) }, end: { x: ax+sz*0.85, y: pH-(ay+sz*0.85) }, thickness: 2.5, color: red });
        p.drawLine({ start: { x: ax+sz*0.85, y: pH-(ay+sz*0.15) }, end: { x: ax+sz*0.15, y: pH-(ay+sz*0.85) }, thickness: 2.5, color: red });
      }
    }
    return new Uint8Array(await doc.save());
  }, [annotations]);

  exportPDFRef.current = exportPDF;
  useImperativeHandle(ref, () => ({ exportPDF }), [exportPDF]);

  /* ── load ── */
  useEffect(() => {
    let cancelled = false;
    setPages([]); setLoading(true); setError(''); setAnnots([]);
    acroVals.current = {};

    (async () => {
      try {
        const res = await fetch(docUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        rawBytes.current = new Uint8Array(await res.arrayBuffer());
        if (cancelled) return;

        const { PDFDocument, PDFTextField, PDFCheckBox, PDFDropdown } = await import('pdf-lib');
        const pdfDoc = await PDFDocument.load(rawBytes.current, { ignoreEncryption: true });
        const libPg  = pdfDoc.getPages();
        const acroByPage: AcroField[][] = libPg.map(() => []);
        try {
          const form = pdfDoc.getForm();
          for (const field of form.getFields()) {
            for (const w of field.acroField.getWidgets()) {
              const pRef = w.P(); if (!pRef) continue;
              const pi = pdfDoc.getPageIndices().find(i => pdfDoc.getPage(i).ref === pRef) ?? 0;
              const { width: pW, height: pH } = libPg[pi].getSize();
              const rect = w.getRectangle(); if (!rect) continue;
              let type: AcroField['type'] = 'text'; let options: string[] | undefined;
              if (field instanceof PDFTextField) type = field.isMultiline() ? 'multiline' as AcroField['type'] : 'text';
              else if (field instanceof PDFCheckBox) type = 'checkbox';
              else if (field instanceof PDFDropdown) { type = 'select'; options = field.getOptions(); }
              acroByPage[pi].push({
                name: field.getName(), type, options,
                x: (rect.x / pW) * pW * SCALE,
                y: (1 - (rect.y + rect.height) / pH) * pH * SCALE,
                w: (rect.width  / pW) * pW * SCALE,
                h: (rect.height / pH) * pH * SCALE,
              });
            }
          }
        } catch { /* */ }

        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        const pdf = await pdfjs.getDocument({ data: rawBytes.current.slice() }).promise;
        if (cancelled) return;
        const rendered: RenderedPage[] = [];
        for (let p = 1; p <= pdf.numPages; p++) {
          if (cancelled) return;
          const page = await pdf.getPage(p);
          const vp   = page.getViewport({ scale: SCALE });
          const canvas = document.createElement('canvas');
          canvas.width = vp.width; canvas.height = vp.height;
          const ctx = canvas.getContext('2d')!;
          await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
          if (cancelled) return;
          rendered.push({ canvas, width: vp.width, height: vp.height, acroFields: acroByPage[p-1] ?? [] });
        }
        setPages(rendered); setLoading(false);
        onLoad?.({ exportPDF: () => exportPDFRef.current!() });
      } catch (e) {
        if (!cancelled) { console.error(e); setError('Failed to load PDF.'); setLoading(false); }
      }
    })();
    return () => { cancelled = true; };
  }, [docUrl]);

  /* ── annotation mutators ── */
  const addAnnot   = (a: Annotation) => setAnnots(prev => [...prev, a]);
  const patchAnnot = (id: string, patch: Partial<Annotation>) =>
    setAnnots(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
  const removeAnnot = (id: string) => {
    setAnnots(prev => prev.filter(a => a.id !== id));
    if (selected === id) setSelected(null);
  };

  /* ── pointer events (signature drawing) ── */
  const onPageDown = (e: React.PointerEvent<HTMLDivElement>, pageIndex: number) => {
    if (tool !== 'sign') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = pageXY(e);
    const id = uid();
    addAnnot({ id, type: 'sign', pageIndex, x, y, points: [[x, y]], strokeColor: '#0f172a', strokeWidth: 2 });
    drawing.current = id;
  };
  const onPageMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const id = drawing.current; if (!id) return;
    const { x, y } = pageXY(e);
    setAnnots(prev => prev.map(a => {
      if (a.id !== id) return a;
      if (a.type === 'sign') return { ...a, points: [...(a.points ?? []), [x, y]] };
      return a;
    }));
  };
  const onPageUp = () => { drawing.current = null; };

  // Click on page — place text, tick or cross
  const onPageClick = (e: React.PointerEvent<HTMLDivElement>, pageIndex: number) => {
    if (tool === 'sign' || tool === 'erase') return;
    const { x, y } = pageXY(e);
    const id = uid();
    if (tool === 'text') {
      addAnnot({ id, type: 'text', pageIndex, x, y, value: '', fontSize: fSize, color });
      setSelected(null);
    } else if (tool === 'tick') {
      addAnnot({ id, type: 'tick', pageIndex, x, y, size: 28 });
    } else if (tool === 'cross') {
      addAnnot({ id, type: 'cross', pageIndex, x, y, size: 28 });
    }
  };

  /* ── annotation interaction: drag to move, tap to select ── */
  const onAnnotPress = (e: React.PointerEvent, ann: Annotation) => {
    e.stopPropagation();
    if (tool === 'erase') { removeAnnot(ann.id); return; }
    // setPointerCapture only works on pointerdown, not click
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* pointer already released */ }
    annPress.current = {
      id: ann.id,
      clientX: e.clientX, clientY: e.clientY,
      origX: ann.x, origY: ann.y,
      origPoints: ann.points ? ann.points.map(p => [...p] as [number,number]) : undefined,
      dragging: false,
    };
  };

  const onAnnotMove = (e: React.PointerEvent) => {
    const p = annPress.current; if (!p) return;
    const dx = e.clientX - p.clientX;
    const dy = e.clientY - p.clientY;
    if (!p.dragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) p.dragging = true;
    if (!p.dragging) return;
    const ddx = dx / zoom, ddy = dy / zoom;
    setAnnots(prev => prev.map(a => {
      if (a.id !== p.id) return a;
      if (a.type === 'sign') {
        const pts = (p.origPoints ?? []).map(([px, py]) => [px + ddx, py + ddy] as [number,number]);
        return { ...a, x: p.origX + ddx, y: p.origY + ddy, points: pts };
      }
      return { ...a, x: p.origX + ddx, y: p.origY + ddy };
    }));
  };

  const onAnnotRelease = () => {
    const p = annPress.current; if (!p) return;
    if (!p.dragging) setSelected(p.id);
    annPress.current = null;
  };

  const onDragMove = onAnnotMove;
  const onDragUp   = onAnnotRelease;

  /* ── helpers ── */
  function pageXY(e: React.PointerEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / zoom, y: (e.clientY - rect.top) / zoom };
  }

  /* ── toolbar ── */
  const TOOLS: { id: Tool; icon: string; label: string }[] = [
    { id: 'text',  icon: 'T',  label: 'Add Text' },
    { id: 'sign',  icon: '✍️', label: 'Signature' },
    { id: 'tick',  icon: '✓',  label: 'Tick' },
    { id: 'cross', icon: '✕',  label: 'Cross' },
    { id: 'erase', icon: '🗑', label: 'Erase' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', ...style }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
        padding: '8px 14px', background: '#1e293b', flexShrink: 0,
        borderBottom: '2px solid #0f172a', userSelect: 'none',
      }}>
        {TOOLS.map(t => (
          <button key={t.id} title={t.label} onClick={() => setTool(t.id)} style={{
            background: tool === t.id ? '#6366f1' : '#334155',
            color: t.id === 'tick' ? (tool === t.id ? '#fff' : '#4ade80') :
                   t.id === 'cross' ? (tool === t.id ? '#fff' : '#f87171') : '#fff',
            border: 'none', borderRadius: 6,
            padding: '6px 13px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
          }}>
            {t.icon} {t.label}
          </button>
        ))}

        <span style={{ width: 1, height: 26, background: '#475569', margin: '0 4px' }} />

        <label style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#cbd5e1', fontSize: '0.75rem' }}>
          Colour
          <input type="color" value={color} onChange={e => setColor(e.target.value)}
            style={{ width: 28, height: 28, border: 'none', padding: 0, cursor: 'pointer', background: 'none' }} />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#cbd5e1', fontSize: '0.75rem' }}>
          Text size
          <input type="number" value={fSize} min={8} max={60} onChange={e => setFSize(+e.target.value)}
            style={{ width: 46, padding: '4px 5px', borderRadius: 4, border: '1px solid #475569', background: '#334155', color: '#fff', fontSize: '0.8rem' }} />
        </label>

        <span style={{ width: 1, height: 26, background: '#475569', margin: '0 4px' }} />

        <button onClick={() => setZoom(z => Math.max(0.4, +(z-0.1).toFixed(1)))}
          style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: 4, padding: '5px 11px', cursor: 'pointer', fontWeight: 900 }}>−</button>
        <span style={{ color: '#e2e8f0', fontSize: '0.78rem', minWidth: 38, textAlign: 'center' }}>{Math.round(zoom*100)}%</span>
        <button onClick={() => setZoom(z => Math.min(3, +(z+0.1).toFixed(1)))}
          style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: 4, padding: '5px 11px', cursor: 'pointer', fontWeight: 900 }}>+</button>

        {selected && (
          <>
            <span style={{ width: 1, height: 26, background: '#475569', margin: '0 4px' }} />
            <button onClick={() => removeAnnot(selected)}
              style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
              🗑 Delete selected
            </button>
          </>
        )}
      </div>

      {/* Canvas area */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', background: '#475569', padding: 24 }}>
        {loading && <div style={{ textAlign: 'center', padding: 60, color: '#e2e8f0' }}>Loading PDF…</div>}
        {error   && <div style={{ textAlign: 'center', padding: 40, color: '#fca5a5' }}>⚠️ {error}</div>}

        <div style={{ display: 'inline-block', transformOrigin: 'top center', transform: `scale(${zoom})` }}>
          {pages.map((pg, pi) => (
            <PageCanvas
              key={pi}
              page={pg}
              pageIndex={pi}
              annotations={annotations.filter(a => a.pageIndex === pi)}
              selected={selected}
              tool={tool}
              acroVals={acroVals.current}
              onAcroChange={(name, val) => { acroVals.current[name] = val; }}
              onAnnotChange={(id, val) => patchAnnot(id, { value: val })}
              onRemove={removeAnnot}
              onSelect={setSelected}
              onAnnotPress={onAnnotPress}
              onDragMove={onDragMove}
              onDragUp={onDragUp}
              onPageDown={e => onPageDown(e, pi)}
              onPageMove={onPageMove}
              onPageUp={onPageUp}
              onPageClick={e => onPageClick(e, pi)}
              zoom={zoom}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default PDFEditor;

/* ═══════════════════════════════════════════════════════════
   PageCanvas
═══════════════════════════════════════════════════════════ */
interface PageCanvasProps {
  page: RenderedPage;
  pageIndex: number;
  annotations: Annotation[];
  selected: string | null;
  tool: Tool;
  acroVals: Record<string,string>;
  onAcroChange: (name: string, val: string) => void;
  onAnnotChange: (id: string, val: string) => void;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
  onAnnotPress: (e: React.PointerEvent, ann: Annotation) => void;
  onDragMove: (e: React.PointerEvent) => void;
  onDragUp: () => void;
  onPageDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPageMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPageUp: () => void;
  onPageClick: (e: React.PointerEvent<HTMLDivElement>) => void;
  zoom: number;
}

function PageCanvas({
  page, annotations, selected, tool, acroVals,
  onAcroChange, onAnnotChange, onSelect,
  onAnnotPress, onDragMove, onDragUp,
  onPageDown, onPageMove, onPageUp, onPageClick,
}: PageCanvasProps) {

  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = mountRef.current; if (!el) return;
    el.innerHTML = '';
    const canvas = page.canvas;
    // eslint-disable-next-line react-hooks/immutability
    canvas.style.display = 'block';
    // eslint-disable-next-line react-hooks/immutability
    canvas.style.position = 'absolute';
    // eslint-disable-next-line react-hooks/immutability
    canvas.style.top = '0';
    // eslint-disable-next-line react-hooks/immutability
    canvas.style.left = '0';
    // eslint-disable-next-line react-hooks/immutability
    canvas.style.pointerEvents = 'none';
    el.appendChild(canvas);
  }, [page.canvas]);

  const isSigning  = tool === 'sign';
  const isErasing  = tool === 'erase';
  const isText     = tool === 'text';
  const isStamping = tool === 'tick' || tool === 'cross';

  return (
    <div
      style={{ position: 'relative', width: page.width, marginBottom: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)', background: '#fff',
        cursor: isErasing ? 'crosshair' : isText || isStamping ? 'cell' : 'default' }}
      onPointerMove={onDragMove}
      onPointerUp={onDragUp}
      onClick={!isSigning ? onPageClick : undefined}
    >
      {/* PDF canvas */}
      <div ref={mountRef} style={{ position: 'relative', width: page.width, height: page.height }} />

      {/* SVG: sign + tick + cross */}
      <svg
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        width={page.width} height={page.height}
      >
        {annotations.map(ann => {
          if (ann.type === 'sign' && ann.points && ann.points.length >= 2) {
            const d = ann.points.map(([px,py],i) => `${i===0?'M':'L'}${px},${py}`).join(' ');
            const xs = ann.points.map(p=>p[0]), ys = ann.points.map(p=>p[1]);
            const bx = Math.min(...xs)-8, by = Math.min(...ys)-8;
            const bw = Math.max(...xs)-bx+16, bh = Math.max(...ys)-by+16;
            return (
              <g key={ann.id}>
                <path d={d} fill="none"
                  stroke={selected===ann.id?'#6366f1':ann.strokeColor??'#000'}
                  strokeWidth={(ann.strokeWidth??2)+(selected===ann.id?1.5:0)}
                  strokeLinecap="round" strokeLinejoin="round" />
                <rect x={bx} y={by} width={bw} height={bh} fill="transparent"
                  style={{ cursor: isErasing ? 'crosshair' : 'grab', pointerEvents: 'auto' }}
                  onPointerDown={e => onAnnotPress(e, ann)}
                  onPointerMove={onDragMove}
                  onPointerUp={onDragUp} />
              </g>
            );
          }
          if (ann.type === 'tick') {
            const s = ann.size ?? 28;
            const { x, y } = ann;
            const stroke = selected === ann.id ? '#6366f1' : '#16a34a';
            return (
              <g key={ann.id}>
                <path
                  d={`M${x+s*0.1},${y+s*0.55} L${x+s*0.4},${y+s*0.85} L${x+s*0.9},${y+s*0.2}`}
                  fill="none" stroke={stroke} strokeWidth={3}
                  strokeLinecap="round" strokeLinejoin="round"
                />
                <rect x={x} y={y} width={s} height={s} fill="transparent"
                  style={{ cursor: isErasing ? 'crosshair' : 'grab', pointerEvents: 'auto' }}
                  onPointerDown={e => onAnnotPress(e, ann)}
                  onPointerMove={onDragMove}
                  onPointerUp={onDragUp} />
              </g>
            );
          }
          if (ann.type === 'cross') {
            const s = ann.size ?? 28;
            const { x, y } = ann;
            const stroke = selected === ann.id ? '#6366f1' : '#dc2626';
            return (
              <g key={ann.id}>
                <path
                  d={`M${x+s*0.15},${y+s*0.15} L${x+s*0.85},${y+s*0.85} M${x+s*0.85},${y+s*0.15} L${x+s*0.15},${y+s*0.85}`}
                  fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round"
                />
                <rect x={x} y={y} width={s} height={s} fill="transparent"
                  style={{ cursor: isErasing ? 'crosshair' : 'grab', pointerEvents: 'auto' }}
                  onPointerDown={e => onAnnotPress(e, ann)}
                  onPointerMove={onDragMove}
                  onPointerUp={onDragUp} />
              </g>
            );
          }
          return null;
        })}
      </svg>

      {/* AcroForm inputs */}
      {page.acroFields.map((f, fi) => {
        const base: React.CSSProperties = {
          position: 'absolute', left: f.x, top: f.y, width: f.w, height: f.h,
          background: 'rgba(219,234,254,0.7)', border: '1.5px solid rgba(99,102,241,0.5)',
          borderRadius: 2, fontSize: Math.min(f.h*0.62, 13), padding: '1px 4px',
          boxSizing: 'border-box', fontFamily: 'Arial,sans-serif', outline: 'none', zIndex: 5,
        };
        if (f.type === 'checkbox') return (
          <input key={fi} type="checkbox" title={f.name} style={{ ...base, cursor:'pointer', background:'transparent' }}
            checked={acroVals[f.name]==='true'} onChange={e => onAcroChange(f.name, String(e.target.checked))} />
        );
        if (f.type === 'select' && f.options) return (
          <select key={fi} title={f.name} style={{ ...base, cursor:'pointer' }}
            value={acroVals[f.name]??''} onChange={e => onAcroChange(f.name, e.target.value)}>
            <option value="">—</option>
            {f.options.map(o=><option key={o} value={o}>{o}</option>)}
          </select>
        );
        if (f.type === 'multiline') return (
          <textarea key={fi} title={f.name} style={{ ...base, resize:'none', lineHeight:1.3 }}
            value={acroVals[f.name]??''} onChange={e => onAcroChange(f.name, e.target.value)} />
        );
        return (
          <input key={fi} type="text" title={f.name} style={base}
            value={acroVals[f.name]??''} onChange={e => onAcroChange(f.name, e.target.value)} />
        );
      })}

      {/* Text annotations */}
      {annotations.filter(a => a.type === 'text').map(ann => (
        <div
          key={ann.id}
          style={{
            position: 'absolute', left: ann.x, top: ann.y, zIndex: 10,
            userSelect: 'none',
          }}
        >
          {/* Drag handle */}
          <div
            title="Hold to move"
            onPointerDown={e => { e.stopPropagation(); onAnnotPress(e, ann); }}
            onPointerMove={onDragMove}
            onPointerUp={onDragUp}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute', top: -10, left: -10,
              width: 20, height: 20, borderRadius: '50%',
              background: isErasing ? '#ef4444' : '#6366f1',
              border: '2px solid #fff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
              cursor: isErasing ? 'crosshair' : 'grab',
              zIndex: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {!isErasing && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1v8M1 5h8M5 1L3.5 2.5M5 1L6.5 2.5M5 9L3.5 7.5M5 9L6.5 7.5M1 5L2.5 3.5M1 5L2.5 6.5M9 5L7.5 3.5M9 5L7.5 6.5"
                  stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            )}
          </div>

          {/* Text box */}
          <div
            onClick={e => { e.stopPropagation(); if (!isErasing) onSelect(ann.id); }}
            onPointerDown={e => { e.stopPropagation(); }}
            style={{
              border: selected===ann.id ? '1.5px solid #6366f1' : '1px dashed rgba(99,102,241,0.45)',
              borderRadius: 3, background: 'rgba(255,255,255,0.85)',
              minWidth: 40, minHeight: 20, cursor: isErasing ? 'crosshair' : 'text',
            }}
          >
            {selected === ann.id && !isErasing ? (
              <textarea
                autoFocus
                value={ann.value ?? ''}
                onChange={e => onAnnotChange(ann.id, e.target.value)}
                onPointerDown={e => e.stopPropagation()}
                style={{
                  border: 'none', borderRadius: 3, padding: '2px 5px',
                  fontSize: ann.fontSize, color: ann.color, background: 'transparent',
                  fontFamily: 'Arial,sans-serif', resize: 'both', minWidth: 80, minHeight: 24,
                  outline: 'none', display: 'block', cursor: 'text',
                }}
              />
            ) : (
              <div style={{
                fontSize: ann.fontSize, color: ann.color, fontFamily: 'Arial,sans-serif',
                padding: '2px 5px', whiteSpace: 'pre-wrap', minWidth: 40, minHeight: 20,
              }}>
                {ann.value || <span style={{ color:'#94a3b8', fontStyle:'italic' }}>Click to type…</span>}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Interaction overlay — only active for signature drawing */}
      {isSigning && (
        <div
          style={{
            position: 'absolute', inset: 0,
            cursor: 'crosshair',
            zIndex: 20,
          }}
          onPointerDown={onPageDown}
          onPointerMove={onPageMove}
          onPointerUp={onPageUp}
        />
      )}
    </div>
  );
}

/* ─── standalone helpers ─────────────────────────────────── */
export async function exportPDF(handle: unknown): Promise<Uint8Array> {
  return (handle as PDFEditorHandle).exportPDF();
}
export function uint8ToBase64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
