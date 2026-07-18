import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Link preview crawlers must receive Open Graph metadata in the initial head.
  htmlLimitedBots: /.*/,
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
