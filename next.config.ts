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

export default nextConfig;
