"use server";

import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type ProcessedData = Record<
  string,
  string | number | boolean | string[] | null
>;
const propertyValueProcessor = (
  value: PageObjectResponse["properties"][string],
): ProcessedData[string] => {
  switch (value.type) {
    case "number":
      return value.number ?? null;

    case "url":
      return value.url ?? null;

    case "checkbox":
      return value.checkbox;

    case "rich_text":
      const richTextData = value.rich_text.map((d) => d.plain_text).join("");

      const formatted = richTextData
        .split("\n")
        .map((line) =>
          line.startsWith("- https://")
            ? `- <a href="${line.replace("- ", "").trim()}" target="_blank">${line.replace("- ", "").trim()}</a>`
            : line,
        )
        .join("<br>");

      return formatted;

    case "select":
      return value.select?.name ?? null;

    case "multi_select":
      return value.multi_select.map(({ name }) => name);

    case "title":
      return value.title[0]?.plain_text ?? "";

    case "files":
      const fileData = value.files[0];
      if (fileData?.type === "file") {
        return fileData.file.url;
      } else if (fileData?.type === "external") {
        return fileData.external.url;
      }
      return null;

    default:
      return value.type;
  }
};

const notionPropertyProcessor = (
  databaseProperties: PageObjectResponse["properties"],
): ProcessedData => {
  const data: ProcessedData = {};

  for (const [key, value] of Object.entries(databaseProperties)) {
    data[key] = propertyValueProcessor(value);
  }

  return data;
};

export default notionPropertyProcessor;
