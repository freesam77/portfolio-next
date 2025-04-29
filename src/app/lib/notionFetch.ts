"use server";

import { Client } from "@notionhq/client";
import {
  PageObjectResponse,
  PartialPageObjectResponse,
  PartialDatabaseObjectResponse,
  DatabaseObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

import notionDatabaseProcessor from "@/app/lib/notionDatabaseProcessor";
import notionPageToHTML from "./notionPageToHTML";

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

const pageFetch = async (database_id: string, sectionName: string) => {
  const result = await notionPageToHTML(database_id, notion);
  return { [sectionName]: result };
};

const databaseFetch = async (
  database_id: string,
  sectionName: string,
  pageContentAsDescription: boolean = false,
) => {
  const response = await notion.databases.query({ database_id });

  const result = await Promise.all(
    response.results.map(async (objectResponse) => {
      if (!isPageObjectResponse(objectResponse)) {
        throw new Error("Response type is not page object");
      }
      const processedData = notionDatabaseProcessor(objectResponse.properties);
      if (pageContentAsDescription) {
        const description = await notionPageToHTML(objectResponse.id, notion);
        Object.assign(processedData, {
          description,
        });
      }
      return processedData;
    }),
  );

  return { [sectionName]: result };
};

const FetchNotion = async () => {
  const sections = await Promise.all([
    pageFetch(process.env.NOTION_LANDING_PAGE_DB!, "landingPage"),
    databaseFetch(process.env.NOTION_LIKES_DB!, "likes"),
    databaseFetch(process.env.NOTION_PROJECTS_DB!, "projects", true),
    databaseFetch(process.env.NOTION_SKILLSET_DB!, "skillset"),
    databaseFetch(process.env.NOTION_ONLINE_PRESENCE_DB!, "contact"),
  ]);

  const result = Object.assign({}, ...sections);
  return result;
};

export default FetchNotion;
