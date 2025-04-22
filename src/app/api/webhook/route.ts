import client from "@/app/lib/redis";
import FetchNotion from "@/app/lib/notionFetch";

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

    const result = await FetchNotion();
    await client.set("portfolioData", JSON.stringify(result));

    return Response.json({ success: true });
  } catch (error) {
    console.error("❌ Error handling webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
