/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Environment variables já são acessíveis via process.env.NEXT_PUBLIC_*
  // não precisa de rewrites para API
}

module.exports = nextConfig
