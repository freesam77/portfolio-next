import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		// Get the path to revalidate from the request body
		const { path } = await request.json();

		if (!path) {
			return Response.json({ error: 'Path is required' }, { status: 400 });
		}

		// Revalidate the specified path
		revalidatePath(path);

		return Response.json({
			message: `Revalidated path: ${path}`,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		return Response.json({ error: 'Failed to revalidate', details: error }, { status: 500 });
	}
}
