import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		// Add formats for better optimization
		formats: ['image/webp', 'image/avif'],
		// Configure allowed image sources using modern remotePatterns
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'i.imgur.com',
			},
			{
				protocol: 'https',
				hostname: 'imgur.com',
			},
			{
				protocol: 'https',
				hostname: 'placehold.co',
			},
			{
				protocol: 'https',
				hostname: 'github.com',
			},
			{
				protocol: 'https',
				hostname: 'cdn2.iconfinder.com',
			},
			{
				protocol: 'https',
				hostname: 'cdn0.iconfinder.com',
			},
			{
				protocol: 'https',
				hostname: 'cdn.svglogos.dev',
			},
			{
				protocol: 'https',
				hostname: 'upload.wikimedia.org',
			},
			{
				protocol: 'https',
				hostname: 'svgrepo.com',
				pathname: '/show/**',
			},
			{
				protocol: 'https',
				hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
			},
		],
	},
	// Optimize for static generation
	output: 'standalone',
	// Enable compression
	compress: true,
};

export default nextConfig;
