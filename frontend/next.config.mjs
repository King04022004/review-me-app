/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // /api/... に来たリクエストを backend の /api/... にプロキシ
      { source: "/api/:path*", destination: "http://localhost:8080/api/:path*" },
    ];
  },
};
export default nextConfig;