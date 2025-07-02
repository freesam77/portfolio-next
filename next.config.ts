import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: ['i.imgur.com', 'placehold.co', 'github.com'],
	},
	// Optimize for static generation
	output: 'standalone',
	// Enable compression
	compress: true,
};

export default nextConfig;
