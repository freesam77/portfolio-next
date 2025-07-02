import client from '@/lib/redisSetup';
import {
	fetchLandingPage,
	fetchLikes,
	fetchProjects,
	fetchSkillset,
	fetchContact,
} from '@/lib/sectionFetch';

export async function fetchPortfolioData() {
	try {
		// Bypass Redis in development mode
		if (process.env.ENV === 'development') {
			// Fetch all sections from Notion directly
			const sections = await Promise.all([
				fetchLandingPage(),
				fetchLikes(),
				fetchProjects(),
				fetchSkillset(),
				fetchContact(),
			]);
			const result = Object.assign({}, ...sections);
			return result;
		} else {
			// Try to get from Redis first (production or other envs)
			const portfolioData = await client.get('portfolioData');
			if (portfolioData) {
				return JSON.parse(portfolioData);
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
			return result;
		}
	} catch (error) {
		console.error('Error fetching portfolio data:', error);
		// Return empty data structure to prevent build failures
		return {
			landingPage: '',
			likes: [],
			projects: [],
			skillset: [],
			contact: [],
		};
	}
}
