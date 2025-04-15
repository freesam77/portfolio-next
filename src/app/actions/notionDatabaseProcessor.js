"use server";
const notionDatabaseProcessor = (databaseItem) => {
  const data = {};
  const valueProcessor = (value) => {
    switch (value.type) {
      case "number":
      case "url":
      case "checkbox":
        return value[value.type];

      case "rich_text":
        const richTextData = value[value.type]
          .map((data) => data.plain_text)
          .join("");

        const formattedRichText = richTextData
          .split("\n")
          .map((line) => {
            if (line.startsWith("- https://")) {
              const url = line.replace("- ", "").trim();
              return `- <a href="${url}" target="_blank">${url}</a>`;
            }
            return line;
          })
          .join("<br>");

        return formattedRichText;

      case "select":
        return value[value.type].name;

      case "multi_select":
        return value[value.type].map(({ name }) => name);

      case "title":
        return value[value.type][0].plain_text;

      case "files":
        return value[value.type][0] && value[value.type][0].file.url;

      default:
        return value.type;
    }
  };
  for (const [key, value] of Object.entries(databaseItem.properties)) {
    const processedValue = valueProcessor(value);
    Object.assign(data, { [key]: processedValue });
  }
  return data;
};

export default notionDatabaseProcessor;
