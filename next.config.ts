import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import type { NextConfig } from "next";

const deploymentEnvironment = process.env.VERCEL_ENV ?? "development";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_VERCEL_ENV: deploymentEnvironment,
    NEXT_PUBLIC_SPOTIFY_ENABLED:
      deploymentEnvironment !== "preview" &&
      process.env.NEXT_PUBLIC_SPOTIFY_ENABLED === "true"
        ? "true"
        : "false",
  },
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
