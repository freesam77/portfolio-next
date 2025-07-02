import client from '@/lib/redisSetup';
import {
	fetchLandingPage,
	fetchLikes,
	fetchProjects,
	fetchSkillset,
	fetchContact,
} from '@/lib/sectionFetch';

export async function GET() {
	try {
		// Try to get from Redis first
		const portfolioData = await client.get('portfolioData');
		if (portfolioData) {
			return Response.json(JSON.parse(portfolioData), { status: 200 });
		}

		// If not in Redis, fetch all sections from Notion
		const sections = await Promise.all([
			fetchLandingPage(),
			fetchLikes(),
			fetchProjects(),
			fetchSkillset(),
			fetchContact(),
		]);

		const result = Object.assign({}, ...sections);

		// Cache the result
		await client.set('portfolioData', JSON.stringify(result));
		return Response.json(result, { status: 200 });
	} catch (error) {
		return Response.json({ error, message: 'Failed to fetch data' }, { status: 500 });
	}
}
