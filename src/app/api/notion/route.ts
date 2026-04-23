import {
	fetchLandingPage,
	fetchLikes,
	fetchProjects,
	fetchSkillset,
	fetchContact,
} from '@/lib/sectionFetch';

export async function GET() {
	try {
		// Fetch all sections from Notion directly
		const sections = await Promise.all([
			fetchLandingPage(),
			fetchLikes(),
			fetchProjects(),
			fetchSkillset(),
			fetchContact(),
		]);

		const result = Object.assign({}, ...sections);
		return Response.json(result, { status: 200 });
	} catch (error) {
		return Response.json({ error, message: 'Failed to fetch data' }, { status: 500 });
	}
}
