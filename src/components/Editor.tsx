'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { Bold, Italic, Code, Image as ImageIcon, Link as LinkIcon, Heading1, Heading2, Upload } from 'lucide-react'
import { useState, useRef } from 'react'

interface EditorProps {
  content?: string
  onChange?: (content: string) => void
}

export default function Editor({ content = '', onChange }: EditorProps) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: 'text-blue-600 hover:underline',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  const addImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (limit to 5MB to prevent crashes)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file is too large. Please choose an image smaller than 5MB.')
        return
      }
      
      setIsUploading(true)
      try {
        // Upload file to server
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (response.ok) {
          const data = await response.json()
          setPreviewImage(data.url)
          setImageFile(file)
        } else {
          alert('Failed to upload image')
        }
      } catch (error) {
        alert('Error uploading image')
      } finally {
        setIsUploading(false)
      }
    }
  }

  const removePreviewImage = () => {
    setPreviewImage('')
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const publishPost = async () => {
    if (!title || !author || !editor) {
      alert('Please fill in all fields')
      return
    }

    setIsPublishing(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          author,
          content: editor.getHTML(),
          previewImage: previewImage || null,
        }),
      })

      if (response.ok) {
        alert('Post published successfully!')
        setTitle('')
        setAuthor('')
        setPreviewImage('')
        setImageFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
        editor.commands.clearContent()
      } else {
        alert('Failed to publish post')
      }
    } catch (error) {
      alert('Error publishing post')
    } finally {
      setIsPublishing(false)
    }
  }

  if (!editor) {
    return null
  }

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

        {/* Preview Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Article Preview Image (Optional)
          </label>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                <Upload size={16} />
                {isUploading ? 'Uploading...' : 'Choose Image'}
              </button>
              {previewImage && (
                <button
                  type="button"
                  onClick={removePreviewImage}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            
            {previewImage && (
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                <div className="mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Preview Image</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This image will appear as a preview on the home page. Recommended size: 400x128px (landscape).
                    The image should fit well within a rectangular container.
                  </p>
                </div>
                <div className="flex gap-4">
                  {/* Full uploaded image */}
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Your uploaded image:</p>
                    <img 
                      src={previewImage} 
                      alt="Uploaded preview" 
                      className="w-full max-w-md h-auto border border-gray-200 dark:border-gray-600 rounded"
                    />
                  </div>
                  {/* Preview as it will appear on home page */}
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">How it will appear on home page:</p>
                    <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-yellow-400 rounded mb-4 flex items-center justify-center overflow-hidden">
                      <img 
                        src={previewImage} 
                        alt="Home page preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      💡 Tip: If your image doesn't fit well, try cropping it to a 3:1 aspect ratio (landscape) before uploading.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 p-4 border border-gray-300 dark:border-gray-600 rounded-t-lg bg-gray-50 dark:bg-gray-700">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded ${
              editor.isActive('bold')
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded ${
              editor.isActive('italic')
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded ${
              editor.isActive('code')
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Code size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded ${
              editor.isActive('heading', { level: 1 })
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Heading1 size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Heading2 size={16} />
          </button>
          <button
            onClick={addImage}
            className="p-2 rounded bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300"
          >
            <ImageIcon size={16} />
          </button>
          <button
            onClick={addLink}
            className="p-2 rounded bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300"
          >
            <LinkIcon size={16} />
          </button>
        </div>

        {/* Editor */}
        <EditorContent
          editor={editor}
          className="prose prose-lg max-w-none min-h-[400px] p-4 border border-t-0 border-gray-300 dark:border-gray-600 rounded-b-lg focus-within:ring-2 focus-within:ring-blue-500 dark:prose-invert"
        />

        {/* Publish Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={publishPost}
            disabled={isPublishing}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
          >
            {isPublishing ? 'Publishing...' : 'Publish Article'}
          </button>
        </div>
      </div>
    </div>
  )
}