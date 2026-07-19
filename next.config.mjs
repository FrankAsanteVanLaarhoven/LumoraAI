/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the tracing root to this project (a stray lockfile lives in the home dir).
  outputFileTracingRoot: import.meta.dirname,
  // playwright-core loads native browser binaries — never bundle it.
  serverExternalPackages: ['playwright-core'],
};

export default nextConfig;
