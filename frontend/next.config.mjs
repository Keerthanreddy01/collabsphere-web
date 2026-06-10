/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevent clickjacking — stops the app from being embedded in iframes
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // Prevent MIME-type sniffing attacks
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Control how much referrer info is sent with requests
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Disable potentially dangerous browser APIs not used by this app
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // Force HTTPS for 1 year (including subdomains)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  // Content Security Policy — restrict where scripts/styles/media can load from
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: self + Next.js inline + Firebase SDKs + EmailJS
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseapp.com https://*.googleapis.com https://apis.google.com https://cdn.emailjs.com",
      // Styles: self + inline (needed for Tailwind)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: self + Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + data URIs + dicebear avatars + Firebase Storage + CloudFront + GitHub avatars
      "img-src 'self' data: blob: https://*.googleusercontent.com https://*.googleapis.com https://api.dicebear.com https://*.firebasestorage.app https://*.cloudfront.net https://*.githubusercontent.com",
      // Media: self + CloudFront (video)
      "media-src 'self' https://*.cloudfront.net",
      // Connect (API calls): self + Firebase + Google APIs + EmailJS
      "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com wss://*.firebaseio.com https://api.emailjs.com",
      // Frames: self + Google auth popup
      "frame-src 'self' https://accounts.google.com https://*.firebaseapp.com",
      // No plugins
      "object-src 'none'",
      // Base URI restriction
      "base-uri 'self'",
      // Form submissions only to self
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: '**.firebasestorage.app' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
