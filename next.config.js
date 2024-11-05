/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        config.ignoreWarnings = [
            { module: /node_modules\/handlebars\/lib\/index\.js/ }
        ];

        return config;
    },
}

module.exports = nextConfig
