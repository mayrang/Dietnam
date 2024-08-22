/** @type {import('next').NextConfig} */
const nextConfig = {
  theme: {
    extend: {
      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "0 2px 4px var(--tw-shadow-color)",
        lg: "0 8px 16px var(--tw-shadow-color)",
      },
    },
  },
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
