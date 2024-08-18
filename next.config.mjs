/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hbaaoqfworvrcuehcypi.supabase.co",
        port: "",
      },
    ],
  },
};

export default nextConfig;
