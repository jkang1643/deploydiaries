"use client"

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { marked } from 'marked';

interface StackEditEmbedProps {
  initialMarkdown?: string;
}

const STACKEDIT_EMBED_URL = "https://stackedit.io/app#embed";

export default function StackEditEmbed({ initialMarkdown }: StackEditEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const router = useRouter();

  // Send initial markdown to StackEdit after iframe loads
  useEffect(() => {
    if (!iframeLoaded || !initialMarkdown) return;
    const postInitialContent = () => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: "openFile",
          file: {
            name: "Draft.md",
            content: { text: initialMarkdown },
          },
        },
        "*"
      );
    };
    setTimeout(postInitialContent, 500);
  }, [iframeLoaded, initialMarkdown]);

  // Listen for StackEdit ready event and getMarkdown response
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin.includes("stackedit.io")) {
        if (event.data?.type === "ready") {
          setLoading(false);
        }
        if (event.data?.type === "markdown" && isPublishing) {
          handlePublish(event.data.content.text);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
    // eslint-disable-next-line
  }, [isPublishing, title, author, previewImage]);

  // Request markdown from StackEdit
  const requestExport = () => {
    setPublishError(null);
    setPublishSuccess(false);
    if (!title || !author) {
      setPublishError("Please fill in all fields");
      setIsPublishing(false);
      return;
    }
    setIsPublishing(true);
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "getMarkdown",
      },
      "*"
    );
  };

  // Actually publish to API
  const handlePublish = async (markdown: string) => {
    try {
      const html = marked.parse(markdown);
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          content: html,
          previewImage: previewImage || null,
        }),
      });
      if (response.ok) {
        setPublishSuccess(true);
        setTitle("");
        setAuthor("");
        setPreviewImage("");
        setTimeout(() => {
          router.push("/");
        }, 1200);
      } else {
        setPublishError("Failed to publish post");
      }
    } catch {
      setPublishError("Error publishing post");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded bg-white dark:bg-gray-800 shadow text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition"
        >
          ← Back
        </button>
      </div>
      {/* Meta Fields & Publish */}
      <div className="w-full max-w-2xl mx-auto mt-8 mb-4 z-10 relative bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Write New Article</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Article Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Author Name"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <input
          type="text"
          placeholder="Preview Image URL (optional)"
          value={previewImage}
          onChange={e => setPreviewImage(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={requestExport}
          disabled={isPublishing || loading}
          className="mt-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors self-end"
        >
          {isPublishing ? "Publishing..." : "Publish Article"}
        </button>
        {publishError && <div className="text-red-600 mt-2">{publishError}</div>}
        {publishSuccess && <div className="text-green-600 mt-2">Article published! Redirecting...</div>}
      </div>
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50 dark:bg-gray-900 bg-opacity-80">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-lg text-gray-700 dark:text-gray-200">Loading editor…</span>
          </div>
        </div>
      )}
      {/* StackEdit iframe */}
      <iframe
        ref={iframeRef}
        src={STACKEDIT_EMBED_URL}
        title="StackEdit Markdown Editor"
        className="flex-1 w-full h-screen border-0 bg-white dark:bg-gray-900"
        onLoad={() => {
          setIframeLoaded(true);
          if (!initialMarkdown) setTimeout(() => setLoading(false), 500);
        }}
        allow="clipboard-write"
      />
    </div>
  );
} 