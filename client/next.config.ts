import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.magicui.design",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-83c5db439b40468498f97946200806f7.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.llm.report",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
