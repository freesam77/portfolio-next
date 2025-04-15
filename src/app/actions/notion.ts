"use server";
import { Client } from "@notionhq/client";
import {
  PageObjectResponse,
  PartialPageObjectResponse,
  DatabaseObjectResponse,
  PartialDatabaseObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

import notionDatabaseProcessor from "./notionDatabaseProcessor";

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const result = {};

const getNotionData = async (database_id: string, sectionName: string) => {
  const response = await notion.databases.query({
    database_id,
  });

  // Narrow the type of item to PageObjectResponse
  Object.assign(result, {
    [sectionName]: response.results.map((item) => {
      // Type guard: Check if item is a PageObjectResponse
      if (isPageObjectResponse(item)) {
        return notionDatabaseProcessor(item);
      }
      return {}; // or handle it differently
    }),
  });

  return result;
};

// Type guard to check if item is a PageObjectResponse
const isPageObjectResponse = (
  item:
    | PageObjectResponse
    | PartialPageObjectResponse
    | PartialDatabaseObjectResponse
    | DatabaseObjectResponse,
): item is PageObjectResponse => {
  return (item as PageObjectResponse).properties !== undefined;
};

const notionLoad = async () => {
  try {
    await getNotionData(process.env.NOTION_DATABASE_ID!, "landingPage");
    await getNotionData(process.env.NOTION_PROJECTS_DATABASE_ID!, "projects");
    await getNotionData(process.env.NOTION_SKILLSET_DATABASE_ID!, "skillset");
    await getNotionData(
      process.env.NOTION_ONLINE_PRESENCE_DATABASE_ID!,
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
