import type { Client } from '@notionhq/client';
import {
	PageObjectResponse,
	PartialPageObjectResponse,
	PartialDatabaseObjectResponse,
	DatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import notionPropertyProcessor from '@/lib/notionPropertyProcessor';
import notionPageToHTML from './notionPageToHTML';

// Type guard
const isPageObjectResponse = (
	item:
		| PageObjectResponse
		| PartialPageObjectResponse
		| PartialDatabaseObjectResponse
		| DatabaseObjectResponse,
): item is PageObjectResponse => {
	return 'properties' in item;
};

export const pageFetch = async (notionClient: Client, page_id: string, sectionName: string) => {
	const result = await notionPageToHTML(notionClient, page_id);
	return { [sectionName]: result };
};

export const databaseFetch = async (
	notionClient: Client,
	database_id: string,
	sectionName: string,
	pageContentAsDescription: boolean = false,
) => {
	const response = await notionClient.databases.query({ database_id });

	const result = await Promise.all(
		response.results.map(async (objectResponse) => {
			if (!isPageObjectResponse(objectResponse)) {
				throw new Error('Response type is not page object');
			}
			const processedData = notionPropertyProcessor(objectResponse.properties);
			if (pageContentAsDescription) {
				const description = await notionPageToHTML(notionClient, objectResponse.id);
				processedData.description = description;
			}
			return processedData;
		}),
	);

	return { [sectionName]: result };
};
