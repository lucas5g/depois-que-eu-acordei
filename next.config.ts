import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Database images can be private drafts, so they must be fetched with the browser session.
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
