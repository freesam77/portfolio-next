import { createClient } from 'redis';

declare global {
	// Allow global var for hot reload in dev
	// eslint-disable-next-line no-var
	var _redisClient: ReturnType<typeof createClient> | undefined;
}

if (!global._redisClient) {
	global._redisClient = createClient({ url: process.env.REDIS_URL });
	global._redisClient.on('error', (err) => console.log('Redis Client Error', err));
	global._redisClient.connect();
}
const client = global._redisClient;

// Optional: Clean up on process exit (dev only)
if (process.env.NODE_ENV === 'development') {
	const cleanup = async () => {
		if (client && client.isOpen) {
			await client.quit();
		}
		process.exit(0);
	};
	process.once('SIGINT', cleanup);
	process.once('SIGTERM', cleanup);
}

export default client;
