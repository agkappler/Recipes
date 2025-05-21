/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    experimental: {
        serverActions: true, // only if using App Router
    },
    // webpack: { devtool: false }
};

module.exports = nextConfig
