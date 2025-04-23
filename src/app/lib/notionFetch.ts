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

const sectionFetch = async (database_id: string, sectionName: string) => {
  const response = await notion.databases.query({ database_id });
  const processedItems = response.results.map((item) =>
    isPageObjectResponse(item) ? notionDatabaseProcessor(item) : {},
  );
  return { [sectionName]: processedItems };
};

const FetchNotion = async () => {
  const sections = await Promise.all([
    sectionFetch(process.env.NOTION_LANDING_PAGE_DB!, "landingPage"),
    sectionFetch(process.env.NOTION_PROJECTS_DB!, "projects"),
    sectionFetch(process.env.NOTION_SKILLSET_DB!, "skillset"),
    sectionFetch(process.env.NOTION_ONLINE_PRESENCE_DB!, "contact"),
  ]);
  const result = Object.assign({}, ...sections);
  return result;
};

export default FetchNotion;
