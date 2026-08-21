/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/bookshelf",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
};

module.exports = nextConfig;