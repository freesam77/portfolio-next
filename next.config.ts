import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: ['i.imgur.com', 'placehold.co', 'github.com', 'cdn2.iconfinder.com', 'cdn0.iconfinder.com', 'cdn.svglogos.dev', 'upload.wikimedia.org', 'svgrepo.com'],
	},
	// Optimize for static generation
	output: 'standalone',
	// Enable compression
	compress: true,
};

export default nextConfig;
