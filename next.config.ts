import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default function config(phase: string): NextConfig {
  if (phase !== PHASE_DEVELOPMENT_SERVER) return nextConfig;

  return {
    ...nextConfig,
    async redirects() {
      return [
        {
          source: "/:path*",
          has: [{ type: "host", value: "localhost" }],
          destination: "http://127.0.0.1:3001/:path*",
          permanent: false,
        },
      ];
    },
  };
}
