import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: ['i.imgur.com', 'imgur.com', 'placehold.co', 'github.com', 'cdn2.iconfinder.com', 'cdn0.iconfinder.com', 'cdn.svglogos.dev', 'upload.wikimedia.org', 'svgrepo.com'],
		// Add formats for better optimization
		formats: ['image/webp', 'image/avif'],
		// Enable remote patterns for better security
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'svgrepo.com',
				port: '',
				pathname: '/show/**',
			},
		],
	},
	// Optimize for static generation
	output: 'standalone',
	// Enable compression
	compress: true,
};

export default nextConfig;
