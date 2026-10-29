/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "s3.eftahfastfood.com",
      "nb3.nonebroker.com"
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://eftahburger.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
