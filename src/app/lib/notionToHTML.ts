"use server";

import type { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  ListBlockChildrenResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

const getBlocks = async (
  blockId: string,
  notionClient: Client,
): Promise<BlockObjectResponse[]> => {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response: ListBlockChildrenResponse =
      await notionClient.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
      });

    const filtered = response.results.filter(
      (b): b is BlockObjectResponse => b.object === "block" && "type" in b,
    );

    blocks.push(...filtered);
    cursor = response.has_more
      ? (response.next_cursor ?? undefined)
      : undefined;
  } while (cursor);

  return blocks;
};

const blocksToHTML = (blocks: BlockObjectResponse[]): string => {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return `<p>${getText(block.paragraph.rich_text)}</p>`;
        case "heading_1":
          return `<h1>${getText(block.heading_1.rich_text)}</h1>`;
        case "heading_2":
          return `<h2>${getText(block.heading_2.rich_text)}</h2>`;
        case "heading_3":
          return `<h3>${getText(block.heading_3.rich_text)}</h3>`;
        case "bulleted_list_item":
          return `<li>${getText(block.bulleted_list_item.rich_text)}</li>`;
        case "numbered_list_item":
          return `<li>${getText(block.numbered_list_item.rich_text)}</li>`;
        case "image":
          const imageUrl =
            block.image.type === "external"
              ? block.image.external.url
              : block.image.file.url;
          return `<img src="${imageUrl}" alt="Image"/>`;
        default:
          return `<div>Unsupported block: ${block.type}</div>`;
      }
    })
    .join("\n");
};

const getText = (richTextArray: RichTextItemResponse[]): string =>
  richTextArray.map((rt) => rt.plain_text).join("");

const extractHTMLFromPage = async (
  pageId: string,
  notionClient: Client,
): Promise<string | null> => {
  const blocks = await getBlocks(pageId, notionClient);
  return blocksToHTML(blocks);
};

export default extractHTMLFromPage;
