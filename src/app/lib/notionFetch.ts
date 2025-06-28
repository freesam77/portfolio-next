"use server";

import { pageFetch, databaseFetch } from "./notionFetchHelpers";

export const fetchLandingPage = async () => {
  return await pageFetch(process.env.NOTION_LANDING_PAGE_DB!, "landingPage");
};

export const fetchLikes = async () => {
  return await databaseFetch(process.env.NOTION_LIKES_DB!, "likes");
};

export const fetchProjects = async () => {
  return await databaseFetch(process.env.NOTION_PROJECTS_DB!, "projects", true);
};

export const fetchSkillset = async () => {
  return await databaseFetch(process.env.NOTION_SKILLSET_DB!, "skillset");
};

export const fetchContact = async () => {
  return await databaseFetch(process.env.NOTION_ONLINE_PRESENCE_DB!, "contact");
};

// For backward compatibility and webhook usage
const FetchNotion = async () => {
  const sections = await Promise.all([
    fetchLandingPage(),
    fetchLikes(),
    fetchProjects(),
    fetchSkillset(),
    fetchContact(),
  ]);

  const result = Object.assign({}, ...sections);
  return result;
};

export default FetchNotion;
