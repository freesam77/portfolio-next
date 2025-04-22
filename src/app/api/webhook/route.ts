import client from "@/app/lib/redis";
import FetchNotion from "@/app/lib/notionFetch";
// import { NextRequest } from "next/server";

export async function POST(req: Request) {
  // TODO: validate
  //   const secret = req.headers.get("x-notion-secret");
  //   if (secret !== process.env.NOTION_WEBHOOK_SECRET) {
  //     return new NextResponse("Unauthorized", { status: 401 });
  //   }
  const body = await req.json();
  console.log("Received webhook:", body);
  
  try {
    const result = await FetchNotion();
    await client.set("portfolioData", JSON.stringify(result));
    return Response.json({ success: true });
  } catch (error) {
    console.error("❌ Error handling webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
