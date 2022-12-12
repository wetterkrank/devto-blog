/**
 * @type {import('next').NextConfig}
 */
 const nextConfig = {
  experimental: {
    // Set to prevent multiple simultaneous getStaticProps calls
    workerThreads: false,
    cpus: 1
  },
}

module.exports = nextConfig
