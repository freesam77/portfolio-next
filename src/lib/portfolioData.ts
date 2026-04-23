import {
	fetchLandingPage,
	fetchLikes,
	fetchProjects,
	fetchSkillset,
	fetchContact,
} from '@/lib/sectionFetch';

export async function fetchPortfolioData() {
	try {
		// Fetch all sections from Notion directly
		const sections = await Promise.all([
			fetchLandingPage(),
			fetchLikes(),
			fetchProjects(),
			fetchSkillset(),
			fetchContact(),
		]);

		return Object.assign({}, ...sections);
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
