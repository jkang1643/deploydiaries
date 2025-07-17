"use client"

import React, { useState } from "react";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface EditorProps {
  content?: string;
  onChange?: (content: string) => void;
}

export default function Editor({ content = "", onChange }: EditorProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [markdown, setMarkdown] = useState(content);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const publishPost = async () => {
    if (!title || !author || !markdown) {
      setPublishError("Please fill in all fields");
      return;
    }
    setIsPublishing(true);
    setPublishError(null);
    setPublishSuccess(false);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          content: markdown,
          previewImage: previewImage || null,
        }),
      });
      if (response.ok) {
        setPublishSuccess(true);
        setTitle("");
        setAuthor("");
        setPreviewImage("");
        setMarkdown("");
        if (onChange) onChange("");
      } else {
        setPublishError("Failed to publish post");
      }
    } catch (error) {
      setPublishError("Error publishing post");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Write New Article
        </h1>
        {/* Meta Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Article Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <input
          type="text"
          placeholder="Preview Image URL (optional)"
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-6"
        />
        {/* Markdown Editor */}
        <div className="mb-6">
          <MDEditor
            value={markdown}
            onChange={(val) => {
              setMarkdown(val || "");
              if (onChange) onChange(val || "");
            }}
            height={400}
          />
        </div>
        {/* Publish Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={publishPost}
            disabled={isPublishing}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
          >
            {isPublishing ? "Publishing..." : "Publish Article"}
          </button>
        </div>
        {publishError && <div className="text-red-600 mt-4">{publishError}</div>}
        {publishSuccess && <div className="text-green-600 mt-4">Article published!</div>}
      </div>
    </div>
  );
}