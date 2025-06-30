import client from "@/app/lib/redisSetup";
import {
    fetchLandingPage,
    fetchLikes,
    fetchProjects,
    fetchSkillset,
    fetchContact,
} from "@/app/lib/sectionFetch";

export async function fetchPortfolioData() {
    try {
        // Try to get from Redis first
        const portfolioData = await client.get("portfolioData");
        if (portfolioData) {
            return JSON.parse(portfolioData);
        }

        // If not in Redis, fetch all sections from Notion
        const sections = await Promise.all([
            fetchLandingPage(),
            fetchLikes(),
            fetchProjects(),
            fetchSkillset(),
            fetchContact(),
        ]);

        const result = Object.assign({}, ...sections);
        
        // Cache the result
        await client.set("portfolioData", JSON.stringify(result));
        return result;
    } catch (error) {
        console.error("Error fetching portfolio data:", error);
        // Return empty data structure to prevent build failures
        return {
            landingPage: "",
            likes: [],
            projects: [],
            skillset: [],
            contact: []
        };
    }
} 