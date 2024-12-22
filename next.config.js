/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        config.ignoreWarnings = [
            { module: /node_modules\/handlebars\/lib\/index\.js/ }
        ];

        return config;
    },
    async rewrites() {
        return [
            {
                source: '/api/map/:path*',
                destination: 'https://api.openfreemap.org/:path*'
            }
        ]
    }
}

module.exports = nextConfig
