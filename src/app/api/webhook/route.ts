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

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return new Response("Content-Type must be application/json", {
        status: 400,
      });
    }

    const payload = await req.json();
    const validWorkspaceId = process.env.VALID_WORKSPACE_ID;

    if (!validWorkspaceId) {
      console.error(
        "❌ VALID_WORKSPACE_ID is not defined in environment variables.",
      );
      return new Response("Server misconfiguration", { status: 500 });
    }

    if (payload.workspace_id !== validWorkspaceId) {
      return Response.json({ error: "Invalid workspace ID" }, { status: 403 });
    }

    // Determine which section was updated based on the payload
    const databaseId = payload.database_id;
    let sectionToUpdate: keyof typeof sectionHandlers | null = null;

    if (databaseId === process.env.NOTION_LANDING_PAGE_DB) {
      sectionToUpdate = "landingPage";
    } else if (databaseId === process.env.NOTION_LIKES_DB) {
      sectionToUpdate = "likes";
    } else if (databaseId === process.env.NOTION_PROJECTS_DB) {
      sectionToUpdate = "projects";
    } else if (databaseId === process.env.NOTION_SKILLSET_DB) {
      sectionToUpdate = "skillset";
    } else if (databaseId === process.env.NOTION_ONLINE_PRESENCE_DB) {
      sectionToUpdate = "contact";
    }

    if (sectionToUpdate) {
      const handler = sectionHandlers[sectionToUpdate];
      const result = await handler();
      await client.set(`portfolioData_${sectionToUpdate}`, JSON.stringify(result));
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("❌ Error handling webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
