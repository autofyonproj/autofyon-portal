import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Security and caching headers for optimal performance and SEO
const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
];

export default function nextConfig(phase: string): NextConfig {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    try {
      initOpenNextCloudflareForDev();
    } catch (e) {
      console.warn("Miniflare init warning:", e);
    }
  }

  return {
    poweredByHeader: false,
    compress: true,
    images: {
      formats: ["image/avif", "image/webp"],
      minimumCacheTTL: 31536000,
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**",
        },
      ],
    },
    async headers() {
      return [
        {
          // Apply security headers to all routes
          source: "/:path*",
          headers: securityHeaders,
        },
        {
          // Cache brand logos and public assets for 7 days with stale-while-revalidate
          source: "/brand/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=604800, stale-while-revalidate=86400",
            },
          ],
        },
      ];
    },
    turbopack: {
      rules: {
        "*.css": {
          loaders: ["@tailwindcss/turbopack"],
          as: "*.css",
        },
      },
    },
  };
}
