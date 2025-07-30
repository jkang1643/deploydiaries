"use client"

import React, { useState } from "react";
import Image from 'next/image';
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface EditorProps {
  title?: string;
  author?: string;
  content?: string;
  previewImage?: string;
  mode?: 'create' | 'edit';
  onSave?: (data: { title: string; author: string; content: string; previewImage?: string }) => Promise<void> | void;
}

// Custom style for blue links in markdown preview
const markdownPreviewStyle = `
  .wmde-markdown a,
  .wmde-markdown a:visited {
    color: #2563eb !important; /* Tailwind blue-600 */
    text-decoration: underline !important;
  }
`;

export default function Editor({
  title = '',
  author = '',
  content = '',
  previewImage = '',
  mode = 'create',
  onSave,
}: EditorProps) {
  const [localTitle, setLocalTitle] = useState(title);
  const [localAuthor, setLocalAuthor] = useState(author);
  const [localPreviewImage, setLocalPreviewImage] = useState(previewImage ?? "");
  const [markdown, setMarkdown] = useState(content);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSave = async () => {
    if (!localTitle || !localAuthor || !markdown) {
      setPublishError('Please fill in all fields');
      return;
    }
    setIsPublishing(true);
    setPublishError(null);
    setPublishSuccess(false);
    try {
      if (onSave) {
        await onSave({
          title: localTitle,
          author: localAuthor,
          content: markdown,
          previewImage: localPreviewImage || undefined,
        });
        setPublishSuccess(true);
      } else {
        // fallback to create mode if no onSave provided
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: localTitle,
            author: localAuthor,
            content: markdown,
            previewImage: localPreviewImage || null,
          }),
        });
        if (response.ok) {
          setPublishSuccess(true);
          setLocalTitle('');
          setLocalAuthor('');
          setLocalPreviewImage('');
          setMarkdown('');
        } else {
          setPublishError('Failed to publish post');
        }
      }
    } catch {
      setPublishError('Error publishing post');
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
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
          />
          <input
            type="text"
            placeholder="Author Name"
            value={localAuthor}
            onChange={(e) => setLocalAuthor(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
          />
        </div>
        
        {/* Preview Image URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Preview Image URL (optional)
          </label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={localPreviewImage ?? ""}
            onChange={(e) => {
              setLocalPreviewImage(e.target.value);
              setImageError(false); // Reset error state when URL changes
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
          />
        </div>
        
        {/* Image Preview */}
        {localPreviewImage && (
          <div className="mb-6 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Preview Image URL: {localPreviewImage}
              </div>
              {!imageError ? (
                <Image 
                  src={localPreviewImage} 
                  alt={`Preview for ${localTitle}`}
                  className="w-full h-64 object-cover rounded-lg"
                  width={600}
                  height={300}
                  onError={(e) => {
                    console.error('Image failed to load:', localPreviewImage);
                    console.error('Error event:', e);
                    setImageError(true);
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', localPreviewImage);
                    setImageError(false);
                  }}
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400 mb-2">
                      Image failed to load
                    </div>
                    <button
                      onClick={() => setImageError(false)}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Markdown Editor */}
        <div className="mb-6" style={{ maxWidth: 900, width: '100%', margin: '0 auto' }}>
          <style>{markdownPreviewStyle}</style>
          <MDEditor
            value={markdown}
            onChange={(val) => {
              setMarkdown(val || "");
            }}
            height={600}
            previewOptions={{ style: { fontSize: '1.1rem' } }}
            textareaProps={{ style: { fontSize: '1.1rem', minHeight: 400 } }}
          />
        </div>
        
        {/* Publish Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isPublishing}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
          >
            {isPublishing ? (mode === 'edit' ? 'Saving...' : 'Publishing...') : (mode === 'edit' ? 'Save Changes' : 'Publish Article')}
          </button>
        </div>
        {publishError && <div className="text-red-600 mt-4">{publishError}</div>}
        {publishSuccess && <div className="text-green-600 mt-4">Article published!</div>}
      </div>
    </div>
  );
}