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
          return `<p>${extractRichText(block.paragraph.rich_text)}</p>`;
        case "heading_1":
          return `<h1>${extractRichText(block.heading_1.rich_text)}</h1>`;
        case "heading_2":
          return `<h2>${extractRichText(block.heading_2.rich_text)}</h2>`;
        case "heading_3":
          return `<h3>${extractRichText(block.heading_3.rich_text)}</h3>`;
        case "bulleted_list_item":
          return `<li>${extractRichText(block.bulleted_list_item.rich_text)}</li>`;
        case "numbered_list_item":
          return `<li>${extractRichText(block.numbered_list_item.rich_text)}</li>`;
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

const extractRichText = (
  richTextArray: RichTextItemResponse[],
): string =>
  richTextArray
    .map((rt) => {
      const mapColor = (notionColor: string): string => {
        const colorMap: Record<string, string> = {
          red: "#e03131",
          blue: "#1971c2",
          green: "#2f9e44",
          yellow: "#f08c00",
          pink: "#d6336c",
          purple: "#7048e8",
          gray: "#495057",
          brown: "#795548",
          orange: "#f76707",
        };

        return colorMap[notionColor.replace("_background", "")] ?? "inherit";
      };

      let text = rt.plain_text;
      const { bold, italic, strikethrough, underline, code, color } =
        rt.annotations;

      if (bold) text = `<strong>${text}</strong>`;
      if (italic) text = `<em>${text}</em>`;
      if (strikethrough) text = `<s>${text}</s>`;
      if (underline) text = `<u>${text}</u>`;
      if (code) text = `<code>${text}</code>`;
      if (color && color !== "default")
        text = `<span style="color: ${mapColor(color)}">${text}</span>`;

      if (rt.href) {
        text = `<a href="${rt.href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      }

      return text;
    })
    .join("");

const notionPageToHTML = async (
  pageId: string,
  notionClient: Client,
): Promise<string | null> => {
  const blocks = await getBlocks(pageId, notionClient);
  return blocksToHTML(blocks);
};

export default notionPageToHTML;
