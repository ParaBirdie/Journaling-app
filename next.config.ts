import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent browsers from MIME-sniffing the content type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Prevent the app from being embedded in iframes (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Enable legacy XSS filter in older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Limit referrer information sent with requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict browser feature access
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Content Security Policy: restrict resource origins
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js requires 'unsafe-inline' and 'unsafe-eval' for its runtime
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Tailwind injects inline styles; Google Fonts for stylesheet
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Google Fonts font files
      "font-src 'self' https://fonts.gstatic.com",
      // Allow data URIs and blobs for any future image support
      "img-src 'self' data: blob:",
      // No external connections
      "connect-src 'self'",
      // Disallow all framing (belt-and-suspenders with X-Frame-Options)
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
