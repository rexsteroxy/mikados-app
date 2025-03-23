import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   /* config options here */
   output: 'export', // Enables static site output
   images: {
     unoptimized: true, // Required for static exports
   },
};

export default nextConfig;
