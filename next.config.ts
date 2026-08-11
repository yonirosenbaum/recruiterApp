import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  compiler: {
    styledComponents: true,
  },
  async redirects() {
    return [
      {
        source: "/lapsed",
        destination: "/watchlist",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    const apiUrl = process.env.API_URL ?? "http://localhost:3001";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  // Tunnel helps avoid ad-blockers dropping events in the browser.
  tunnelRoute: "/monitoring",
  widenClientFileUpload: true,
  disableLogger: true,
});
