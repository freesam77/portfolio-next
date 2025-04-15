"use server";
import { Client } from "@notionhq/client";
import notionDatabaseProcessor from "./notionDatabaseProcessor";

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const result = {};

const getNotionData = async (database_id, sectionName) => {
  const response = await notion.databases.query({
    database_id,
  });

  Object.assign(result, {
    [sectionName]: response.results.map((item) =>
      notionDatabaseProcessor(item),
    ),
  });

  return result;
};

const notionLoad = async () => {
  try {
    await getNotionData(process.env.NOTION_DATABASE_ID, "landingPage");
    await getNotionData(process.env.NOTION_PROJECTS_DATABASE_ID, "projects");
    await getNotionData(process.env.NOTION_SKILLSET_DATABASE_ID, "skillset");
    await getNotionData(
      process.env.NOTION_ONLINE_PRESENCE_DATABASE_ID,
      "contact",
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error fetching Notion data:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Failed to fetch data from Notion API" }),
    };
  }
};

export default notionLoad;
