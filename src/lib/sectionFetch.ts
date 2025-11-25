'use server';

import { Client } from '@notionhq/client';
import { pageFetch, databaseFetch } from './notionFetch';
import { preloadSkillsetIcons } from './imageCache';

// Initialize Notion client
const notionClient = new Client({ auth: process.env.NOTION_API_KEY });

export const fetchLandingPage = async () => {
	return await pageFetch(notionClient, process.env.NOTION_LANDING_PAGE_DB!, 'landingPage');
};

export const fetchLikes = async () => {
	return await databaseFetch(notionClient, process.env.NOTION_LIKES_DB!, 'likes');
};

export const fetchProjects = async () => {
	return await databaseFetch(notionClient, process.env.NOTION_PROJECTS_DB!, 'projects', true);
};

export const fetchSkillset = async () => {
	const result = await databaseFetch(notionClient, process.env.NOTION_SKILLSET_DB!, 'skillset');
	// Pre-cache skillset icons to avoid rate limiting
	if (result.skillset) {
		const cachedSkillset = await preloadSkillsetIcons(result.skillset);
		return { skillset: cachedSkillset };
	}
	return result;
};

export const fetchContact = async () => {
	return await databaseFetch(notionClient, process.env.NOTION_ONLINE_PRESENCE_DB!, 'contact');
};

// For backward compatibility and webhook usage
const SectionFetch = async () => {
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

export default SectionFetch;
