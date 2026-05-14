import type { NextConfig } from "next";

// Content Security Policy.
//   - 'self' for first-party assets.
//   - Supabase: API + storage + realtime websocket.
//   - Square: payment iframe + assets.
//   - reCAPTCHA: scripts + iframe.
//   - Google Fonts: stylesheet + font CDN.
//   - inline scripts allowed (Next.js needs them for hydration); add a nonce
//     if you ever lock this down further.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://web.squarecdn.com https://sandbox.web.squarecdn.com https://static.cloudflareinsights.com https://cdnjs.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://*.supabase.co https://pt1.webxoo.com https://images.unsplash.com https://www.gstatic.com https://www.google.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co https://pt1.webxoo.com wss://*.supabase.co wss://pt1.webxoo.com https://connect.squareup.com https://connect.squareupsandbox.com https://www.google.com https://cloudflareinsights.com https://maps.googleapis.com",
  "frame-src 'self' https://www.google.com https://www.googletagmanager.com https://web.squarecdn.com https://sandbox.web.squarecdn.com",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=(self)" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  images: {
    qualities: [100, 90, 82, 75],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/**",
      },
      {
        protocol: "https",
        hostname: "pt1.webxoo.com",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
  transpilePackages: ["pdfjs-dist"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Long-lived cache for hashed Next.js asset chunks.
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Sitemap & robots — short-lived edge cache.
        source: "/sitemap.xml",
        headers: [
          { key: "Cache-Control", value: "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
