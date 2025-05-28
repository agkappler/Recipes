
/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: { devtool: false },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'fargopolis-bucket.s3.amazonaws.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

module.exports = nextConfig;