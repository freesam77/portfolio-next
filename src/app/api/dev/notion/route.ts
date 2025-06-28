import client from "@/app/lib/redisSetup";
import SectionFetch from "@/app/lib/sectionFetch";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const writeRedis = url.searchParams.get("write-redis") === "true";
    const result = await SectionFetch();

    if (writeRedis) {
      await client.set("portfolioData", JSON.stringify(result));
    }
    return Response.json(result, { status: 200 });
  } catch (error) {
    return Response.json(
      { error, message: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
