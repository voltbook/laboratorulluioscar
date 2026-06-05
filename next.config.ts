import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/brand/**",
      },
      {
        pathname: "/api/placeholder",
      },
    ],
  },
};

export default nextConfig;
