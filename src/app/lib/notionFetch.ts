"use server";

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

const sectionFetch = async (databaseId: string, sectionName: string) => {
  const response = await notion.databases.query({ database_id: databaseId });
  const processedItems = response.results.map((item) =>
    isPageObjectResponse(item) ? notionDatabaseProcessor(item) : {},
  );
  return { [sectionName]: processedItems };
};

const FetchNotion = async () => {
  const sections = await Promise.all([
    sectionFetch(process.env.NOTION_DATABASE_ID!, "landingPage"),
    sectionFetch(process.env.NOTION_PROJECTS_DATABASE_ID!, "projects"),
    sectionFetch(process.env.NOTION_SKILLSET_DATABASE_ID!, "skillset"),
    sectionFetch(
      process.env.NOTION_ONLINE_PRESENCE_DATABASE_ID!,
      "contact",
    ),
  ]);
  const result = Object.assign({}, ...sections);
  return result;
};

export default FetchNotion;
