"use server";

import type { Client } from "@notionhq/client";
import {
    BlockObjectResponse,
    BulletedListItemBlockObjectResponse,
    ListBlockChildrenResponse,
    NumberedListItemBlockObjectResponse,
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

const blocksToHTML = async (
    blocks: BlockObjectResponse[],
    notionClient?: Client,
): Promise<string> => {
    let html = "";
    let listBuffer: string[] = [];
    let currentBlockType: "ul" | "ol" | "div" | null = null;

    const flushList = () => {
        if (currentBlockType && listBuffer.length > 0) {
            html += `<${currentBlockType}>\n${listBuffer.join("\n")}\n</${currentBlockType}>\n`;
            listBuffer = [];
            currentBlockType = null;
        }
    };

    const getNestedListHTML = async (
        block:
            | BulletedListItemBlockObjectResponse
            | NumberedListItemBlockObjectResponse,
        blockId: string,
        notionClient?: Client,
    ): Promise<void> => {
        let nestedListHtml = "";
        if (notionClient) {
            const childBlocks = await getBlocks(blockId, notionClient);
            if (childBlocks.length > 0) {
                nestedListHtml = await blocksToHTML(childBlocks, notionClient);
            }
        }

        // Type guard using discriminated unions
        if (block.type === "bulleted_list_item") {
            listBuffer.push(
                `<li>${extractRichText(block.bulleted_list_item.rich_text)}${nestedListHtml ? `\n${nestedListHtml}` : ""
                }</li>`,
            );
        } else if (block.type === "numbered_list_item") {
            listBuffer.push(
                `<li>${extractRichText(block.numbered_list_item.rich_text)}${nestedListHtml ? `\n${nestedListHtml}` : ""
                }</li>`,
            );
        }
    };

    for (const block of blocks) {
        switch (block.type) {
            case "paragraph":
                flushList();
                html += `<p>${extractRichText(block.paragraph.rich_text)}</p>\n`;
                break;
            case "heading_1":
                flushList();
                html += `<h1>${extractRichText(block.heading_1.rich_text)}</h1>\n`;
                break;
            case "heading_2":
                flushList();
                html += `<h2>${extractRichText(block.heading_2.rich_text)}</h2>\n`;
                break;
            case "heading_3":
                flushList();
                html += `<h3>${extractRichText(block.heading_3.rich_text)}</h3>\n`;
                break;
            case "callout":
                flushList();
                if (notionClient) {
                    const childBlocks = await getBlocks(block.id, notionClient);
                    const nestedHtml = await blocksToHTML(childBlocks, notionClient);
                    html += `<div class="callout">${extractRichText(
                        block.callout.rich_text,
                    )}${nestedHtml ? `\n${nestedHtml}` : ""}</div>\n`;
                }
                break;
            case "synced_block":
                flushList();
                if (!notionClient) break;
                const syncedChildren = await getBlocks(block.id, notionClient);
                const syncedHtml = await blocksToHTML(syncedChildren, notionClient);
                html += `<div>\n${syncedHtml}\n</div>\n`;
                break;
            case "bulleted_list_item":
                if (currentBlockType !== "ul") flushList();
                currentBlockType = "ul";
                await getNestedListHTML(block, block.id, notionClient);
                break;
            case "numbered_list_item":
                if (currentBlockType !== "ol") flushList();
                currentBlockType = "ol";
                await getNestedListHTML(block, block.id, notionClient);
                break;
            case "image":
                flushList();
                const imageUrl =
                    block.image.type === "external"
                        ? block.image.external.url
                        : block.image.file.url;
                html += `<img src="${imageUrl}" alt="Image"/>\n`;
                break;
            case "embed":
                flushList();
                try {
                    const { headers } = await fetch(block.embed.url);
                    if (headers.get("content-type")?.includes("image")) {
                        html += `<img src="${block.embed.url}" alt="Image"/>\n`;
                    }
                } catch (err: unknown) {
                    throw err;
                }
                break;
            case "column_list":
                flushList();
                html += `<div class="column-list">\n`;
                if (!notionClient) {
                    break;
                }

                const columnBlocks = await getBlocks(block.id, notionClient);

                for (const column of columnBlocks) {
                    if (column.type === "column") {
                        const columnChildren = await getBlocks(column.id, notionClient);
                        const columnContent = await blocksToHTML(columnChildren);
                        html += `<div class="column">\n${columnContent}\n</div>\n`;
                    }
                }

                html += `</div>\n`;
                break;
            case "child_page":
            case "child_database":
                break;
            default:
                flushList();
                html += `<div>Unsupported block: ${block.type}</div>\n`;
                break;
        }
    }

    flushList(); // In case the last blocks are list items
    return html.trim();
};

const extractRichText = (richTextArray: RichTextItemResponse[]): string =>
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
    notionClient: Client,
    pageId: string,
): Promise<string | null> => {
    const blocks = await getBlocks(pageId, notionClient);
    return await blocksToHTML(blocks, notionClient);
};

export default notionPageToHTML;
