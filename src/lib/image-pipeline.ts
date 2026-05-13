/**
 * Image processing pipeline.
 *
 * - Converts uploaded images to WebP
 * - Strips EXIF metadata (sharp does this by default unless withMetadata is called)
 * - Auto-rotates by EXIF orientation, then drops the EXIF
 * - Resizes to a maximum of MAX_WIDTH while preserving aspect ratio and
 *   refusing to upscale smaller originals
 *
 * Sharp is loaded dynamically so that the rest of the app keeps building
 * if sharp is not installed in a given environment (e.g. an edge runtime).
 * If sharp is unavailable, processImage returns the original buffer/MIME
 * unchanged so uploads still succeed.
 */

export const MAX_WIDTH = 1920;
export const WEBP_QUALITY = 82;

export const ACCEPTED_IMAGE_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/heic',
  'image/heif',
  'image/tiff',
]);

export interface ProcessedImage {
  buffer: Buffer;
  mime: string;
  ext: string;
  width: number | null;
  height: number | null;
  bytes: number;
  transformed: boolean;
}

export function isProcessableImage(mime: string | null | undefined, name?: string): boolean {
  if (mime && ACCEPTED_IMAGE_MIME.has(mime.toLowerCase())) return true;
  if (!name) return false;
  return /\.(jpe?g|png|webp|avif|gif|heic|heif|tiff?)$/i.test(name);
}

/**
 * Best-effort image normalization. Falls back to the original bytes if sharp
 * is missing or the image cannot be decoded.
 */
export async function processImage(
  input: Buffer | Uint8Array,
  originalMime?: string,
): Promise<ProcessedImage> {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);

  // Cap input size at 25 MB — reject obvious abuse.
  if (buffer.byteLength > 25 * 1024 * 1024) {
    return {
      buffer,
      mime: originalMime || 'application/octet-stream',
      ext: extFromMime(originalMime),
      width: null,
      height: null,
      bytes: buffer.byteLength,
      transformed: false,
    };
  }

  type SharpModule = typeof import('sharp');
  let sharp: SharpModule | null = null;
  try {
    const mod = await import('sharp');
    // Handle both CJS (`module.exports = sharp`) and ESM default-export shapes.
    sharp = ((mod as unknown as { default?: SharpModule }).default ?? mod) as SharpModule;
  } catch {
    sharp = null;
  }

  if (!sharp) {
    return {
      buffer,
      mime: originalMime || 'application/octet-stream',
      ext: extFromMime(originalMime),
      width: null,
      height: null,
      bytes: buffer.byteLength,
      transformed: false,
    };
  }

  try {
    const pipeline = sharp(buffer, { failOn: 'truncated' })
      .rotate()
      .withMetadata({ orientation: undefined });

    const meta = await pipeline.metadata();
    const targetWidth =
      meta.width && meta.width > MAX_WIDTH ? MAX_WIDTH : meta.width ?? null;

    const out = await pipeline
      .resize({
        width: targetWidth ?? undefined,
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    return {
      buffer: out.data,
      mime: 'image/webp',
      ext: 'webp',
      width: out.info.width ?? null,
      height: out.info.height ?? null,
      bytes: out.data.byteLength,
      transformed: true,
    };
  } catch (err) {
    console.warn('[image-pipeline] sharp failed, falling back to original:', err);
    return {
      buffer,
      mime: originalMime || 'application/octet-stream',
      ext: extFromMime(originalMime),
      width: null,
      height: null,
      bytes: buffer.byteLength,
      transformed: false,
    };
  }
}

function extFromMime(mime?: string): string {
  if (!mime) return 'bin';
  const m = mime.toLowerCase();
  if (m.includes('webp')) return 'webp';
  if (m.includes('png')) return 'png';
  if (m.includes('avif')) return 'avif';
  if (m.includes('gif')) return 'gif';
  if (m.includes('jpeg') || m.includes('jpg')) return 'jpg';
  if (m.includes('tiff')) return 'tiff';
  if (m.includes('heic') || m.includes('heif')) return 'heic';
  return 'bin';
}
