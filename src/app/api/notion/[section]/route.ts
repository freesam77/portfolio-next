import client from "@/app/lib/redis";
import {
    fetchLandingPage,
    fetchLikes,
    fetchProjects,
    fetchSkillset,
    fetchContact,
} from "@/app/lib/notionFetch";
import { NextResponse } from "next/server";

const sectionHandlers = {
    landingPage: fetchLandingPage,
    likes: fetchLikes,
    projects: fetchProjects,
    skillset: fetchSkillset,
    contact: fetchContact,
};

export async function GET(
    request: Request,
    { params }: { params: Promise<{ section: string }> }

) {
    try {
        const { section } = await params;
        const handler = sectionHandlers[section as keyof typeof sectionHandlers];

        if (!handler) {
            return NextResponse.json(
                { error: "Invalid section" },
                { status: 400 }
            );
        }

        // Try to get from Redis first
        const cachedData = await client.get(`portfolioData_${section}`);
        if (cachedData) {
            return NextResponse.json(JSON.parse(cachedData), { status: 200 });
        }

        // If not in Redis, fetch from Notion
        const result = await handler();
        await client.set(`portfolioData_${section}`, JSON.stringify(result));
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : String(error), message: "Failed to fetch data" },
            { status: 500 }
        );
    }
} 