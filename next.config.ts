import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
} as any;

(nextConfig as any).eslint = { ignoreBuildErrors: true };

export default nextConfig;
