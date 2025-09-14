import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint during production builds (e.g., on Vercel)
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kmp-admin.perspectiveunity.com",
        port: "",
        pathname: "/flags/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
