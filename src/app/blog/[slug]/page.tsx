'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github.css'

interface BlogPost {
  id: string
  title: string
  author: string
  date: string
  content: string
  excerpt?: string
  images?: string[]
  slug: string
  createdAt?: string
}

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.slug}`)
        if (!response.ok) {
          throw new Error('Post not found')
        }
        const data = await response.json()
        setPost(data.post)
      } catch (error) {
        setError('Post not found')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchPost()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Post Not Found
          </h1>
          <Link
            href="/blog"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link
            href="/blog"
            className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            ← Back to Blog
          </Link>
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            Modernist
          </Link>
        </div>
      </header>

      {/* Article */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <span className="font-medium">{post.author}</span>
              <span className="mx-2">•</span>
              <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
            </div>
          </header>
          
          {/* Markdown Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight, rehypeSlug, rehypeAutolinkHeadings]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-4xl mb-6 mt-10 text-black font-extrabold" style={{fontFamily: 'inherit'}} {...props} />,
                h2: ({node, ...props}) => <h2 className="text-3xl mb-5 mt-8 text-gray-800 font-bold" style={{fontFamily: 'inherit'}} {...props} />,
                h3: ({node, ...props}) => <h3 className="text-2xl mb-4 mt-6 text-gray-700 font-semibold" style={{fontFamily: 'inherit'}} {...props} />,
                h4: ({node, ...props}) => <h4 className="text-xl mb-3 mt-5 text-gray-600 font-medium" style={{fontFamily: 'inherit'}} {...props} />,
                h5: ({node, ...props}) => <h5 className="text-lg mb-2 mt-4 text-gray-500 font-medium" style={{fontFamily: 'inherit'}} {...props} />,
                h6: ({node, ...props}) => <h6 className="text-base mb-1 mt-3 text-gray-400 font-medium uppercase tracking-wider" style={{fontFamily: 'inherit'}} {...props} />,
                a: ({node, ...props}) => <a className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors" {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-12 flex justify-between">
          <Link
            href="/blog"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            ← All Posts
          </Link>
          <Link
            href="/write"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Write Article
          </Link>
        </div>
      </main>
    </div>
  )
}