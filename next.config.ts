import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/brand/**",
      },
      {
        pathname: "/games/**",
      },
      {
        pathname: "/api/placeholder",
      },
    ],
  },
};

export default nextConfig;
