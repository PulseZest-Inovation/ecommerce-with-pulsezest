/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Optionally enable React Strict Mode
  images: {
    domains: ['storage.googleapis.com', 'storage.cloud.google.com', 'firebasestorage.googleapis.com'], // Allow both domains
  },
};

module.exports = nextConfig;
