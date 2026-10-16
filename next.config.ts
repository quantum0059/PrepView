import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Proxy Firebase Auth handler through our own domain.
  // This fixes signInWithRedirect on production: modern browsers block
  // cross-origin storage, so getRedirectResult() returns null when the
  // auth handler lives on firebaseapp.com. By routing /__/auth/* through
  // our own origin, the entire flow stays same-origin.
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination:
          "https://prepwise-1d3ac.firebaseapp.com/__/auth/:path*",
      },
      {
        source: "/__/firebase/:path*",
        destination:
          "https://prepwise-1d3ac.firebaseapp.com/__/firebase/:path*",
      },
    ];
  },
};

export default nextConfig;
