import client from "@/app/lib/redis";
import {
  fetchLandingPage,
  fetchLikes,
  fetchProjects,
  fetchSkillset,
  fetchContact,
} from "@/app/lib/notionFetch";

const sectionHandlers = {
  landingPage: fetchLandingPage,
  likes: fetchLikes,
  projects: fetchProjects,
  skillset: fetchSkillset,
  contact: fetchContact,
};

export async function GET(
  request: Request,
  context: { params: { section: keyof typeof sectionHandlers } }
) {
  try {
    const { section } = await Promise.resolve(context.params);
    const handler = sectionHandlers[section];

    if (!handler) {
      return Response.json(
        { error: "Invalid section" },
        { status: 400 }
      );
    }

    // Try to get from Redis first
    const cachedData = await client.get(`portfolioData_${section}`);
    if (cachedData) {
      return Response.json(JSON.parse(cachedData), { status: 200 });
    }

    // If not in Redis, fetch from Notion
    const result = await handler();
    await client.set(`portfolioData_${section}`, JSON.stringify(result));
    return Response.json(result, { status: 200 });
  } catch (error) {
    return Response.json(
      { error, message: "Failed to fetch data" },
      { status: 500 }
    );
  }
} 