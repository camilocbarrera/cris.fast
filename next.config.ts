import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.0.56",
    "http://192.168.0.56:3000",
    "192.168.*.*",
  ],
};

export default nextConfig;
