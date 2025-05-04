import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "*.systemsltd.com", // Wildcard to cover www.systemsltd.com
      },
      {
        protocol: "https",
        hostname: "*.hbl.com",
      },
      {
        protocol: "https",
        hostname: "*.jazz.com.pk",
      },
      {
        protocol: "https",
        hostname: "*.engro.com",
      },
      {
        protocol: "https",
        hostname: "*.telenor.com.pk",
      },
      {
      protocol: "https",
        hostname: "*.netsoltech.com",
      },
    ],
  },
}

export default nextConfig