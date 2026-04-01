import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include context/ files (one level above frontend/) in Vercel serverless bundle
  outputFileTracingRoot: path.join(__dirname, "../"),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
