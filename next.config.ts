/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shared.fastly.steamstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'steamcdn-a.akamaihd.net',
      },
      {
        protocol: 'https',
        hostname: 'cdn.cloudflare.steamstatic.com',
      },
      // Por si acaso otras tiendas usan dominios distintos
      {
        protocol: 'https',
        hostname: '**', // Esto permite cualquier dominio (solo para dev, quítalo en producción si quieres más seguridad)
      },
    ],
  },
};

module.exports = nextConfig;