import client from '@/lib/redisSetup';
import { revalidatePath } from 'next/cache';
import {
	fetchLandingPage,
	fetchLikes,
	fetchProjects,
	fetchSkillset,
	fetchContact,
} from '@/lib/sectionFetch';

const sectionHandlers = {
	landingPage: fetchLandingPage,
	likes: fetchLikes,
	projects: fetchProjects,
	skillset: fetchSkillset,
	contact: fetchContact,
};

export async function POST(req: Request) {
	try {
		const contentType = req.headers.get('content-type') || '';
		if (!contentType.includes('application/json')) {
			return new Response('Content-Type must be application/json', {
				status: 400,
			});
		}

		const payload = await req.json();
		const validWorkspaceId = process.env.VALID_WORKSPACE_ID;

		if (!validWorkspaceId) {
			console.error('❌ VALID_WORKSPACE_ID is not defined in environment variables.');
			return new Response('Server misconfiguration', { status: 500 });
		}

		if (payload.workspace_id !== validWorkspaceId) {
			return Response.json({ error: 'Invalid workspace ID' }, { status: 403 });
		}

		// Always update all sections on every webhook
		const allSections = Object.keys(sectionHandlers);
		for (const section of allSections) {
			const handler = sectionHandlers[section as keyof typeof sectionHandlers];
			const result = await handler();
			await client.set(`portfolioData_${section}`, JSON.stringify(result));
		}

		// Clear the main portfolio data cache to force fresh data on next request
		await client.del('portfolioData');

		// Trigger ISR revalidation for the home page
		revalidatePath('/');

		return Response.json({
			success: true,
			message: 'Data updated and ISR revalidation triggered',
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error('❌ Error handling webhook:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
