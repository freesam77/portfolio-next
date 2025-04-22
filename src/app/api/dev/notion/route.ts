import client from "@/app/lib/redis";
import FetchNotion from "@/app/lib/notionFetch";

export async function GET() {
  try {
    const result = await FetchNotion();
    await client.set("portfolioData", JSON.stringify(result));
    return Response.json(result, { status: 200 });
  } catch (error) {
    return Response.json(
      { error, message: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
