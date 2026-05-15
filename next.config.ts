import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "..",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "art.hearthstonejson.com",
      },
      {
        protocol: "https",
        hostname: "hearthstonejson.com",
      },
    ],
  },
};

export default nextConfig;
