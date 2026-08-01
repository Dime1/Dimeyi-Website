import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/schedule', destination: '/d-day', permanent: true },
      { source: '/travel',   destination: '/d-day', permanent: true },
    ]
  },
}

export default nextConfig
