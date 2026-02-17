/**
 * @type {import('next').NextConfig}
 */
 const nextConfig = {
  experimental: {
    // Set to prevent multiple simultaneous getStaticProps calls
    workerThreads: false,
    cpus: 1,
    staticGenerationMaxConcurrency: 1, // 1 page at a time per worker
    staticGenerationRetryCount: 3,     // retries failed page generation
  },
}

module.exports = nextConfig
