import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		// Add formats for better optimization
		formats: ['image/webp', 'image/avif'],
		// Allow Notion file uploads from AWS S3
		domains: ['prod-files-secure.s3.us-west-2.amazonaws.com'],
	},
	// Optimize for static generation
	output: 'standalone',
	// Enable compression
	compress: true,
};

export default nextConfig;
