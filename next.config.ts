import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/js/[name].[hash][ext]',
      },
    });

    return config;
  },
};

export default nextConfig;
