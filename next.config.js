/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: "https://veritystack.onrender.com",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;