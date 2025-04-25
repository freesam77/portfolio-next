"use client";

import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const ErrorComponent = ({ error }: { error: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(error);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const mailtoLink = `mailto:samuelrazali@gmail.com?subject=${encodeURIComponent(
    "Bug report from Portfolio Site",
  )}&body=${encodeURIComponent(`Hi Samuel,\n\nI encountered the following error:\n\n${error}`)}`;

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="pt-20 max-w-[90%]">
        <div className="text-center mb-4">
          <h2>Oops, looks like it kicked the bucket...</h2>
          <h3>
            Please copy the error below and{" "}
            <a
              href={mailtoLink}
              className="underline text-blue-400 hover:text-blue-500"
            >
              let me know about it!
            </a>
          </h3>
        </div>

        <div className="text-left max-w-[800px] card p-5 flex gap-2">
          <code className="block text-red-200 rounded-md whitespace-pre-wrap break-words overflow-x-auto">
            {error}
          </code>
          <button
            onClick={handleCopy}
            title="Copy to clipboard"
            className="transition w-[50px] h-[40px]"
          >
            <ContentCopyIcon fontSize="small" />
          </button>
        </div>
        <h3
          className={`text-green-300 ${
            copied ? "opacity-100" : "opacity-0"
          } text-right transition-opacity duration-300`}
        >
          Copied!
        </h3>
      </div>
    </div>
  );
};

export default ErrorComponent;
