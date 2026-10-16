import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Proxy Firebase Auth handler through our own domain.
  // When authDomain = prep-view-fe2b.vercel.app, Firebase sends:
  //   redirect_uri = https://prep-view-fe2b.vercel.app/__/auth/handler
  // These rewrites forward that path to the real Firebase auth handler
  // so the entire flow stays same-origin and getRedirectResult() works.
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: "https://prepwise-1d3ac.firebaseapp.com/__/auth/:path*",
      },
      {
        source: "/__/firebase/:path*",
        destination: "https://prepwise-1d3ac.firebaseapp.com/__/firebase/:path*",
      },
    ];
  },
};

export default nextConfig;
