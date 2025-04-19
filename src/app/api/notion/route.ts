import { Client } from "@notionhq/client";
import {
  PageObjectResponse,
  PartialPageObjectResponse,
  PartialDatabaseObjectResponse,
  DatabaseObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import notionDatabaseProcessor from "@/app/lib/notionDatabaseProcessor";

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Type guard
const isPageObjectResponse = (
  item:
    | PageObjectResponse
    | PartialPageObjectResponse
    | PartialDatabaseObjectResponse
    | DatabaseObjectResponse,
): item is PageObjectResponse => {
  return "properties" in item;
};

export async function GET() {
  const fetchNotionSection = async (
    databaseId: string,
    sectionName: string,
  ) => {
    const response = await notion.databases.query({ database_id: databaseId });
    const processedItems = response.results.map((item) =>
      isPageObjectResponse(item) ? notionDatabaseProcessor(item) : {},
    );
    return { [sectionName]: processedItems };
  };

  try {
    const sections = await Promise.all([
      fetchNotionSection(process.env.NOTION_DATABASE_ID!, "landingPage"),
      fetchNotionSection(process.env.NOTION_PROJECTS_DATABASE_ID!, "projects"),
      fetchNotionSection(process.env.NOTION_SKILLSET_DATABASE_ID!, "skillset"),
      fetchNotionSection(
        process.env.NOTION_ONLINE_PRESENCE_DATABASE_ID!,
        "contact",
      ),
    ]);

    const result = Object.assign({}, ...sections);
    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching Notion data:", error);
    return Response.json(
      { error: "Failed to fetch data from Notion API" },
      { status: 500 },
    );
  }
}
