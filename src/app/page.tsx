'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface BlogPost {
  id: string
  title: string
  author: string
  date: string
  content: string
  excerpt?: string
  images?: string[]
  slug: string
}

export default function Home() {
  const [latestPost, setLatestPost] = useState<BlogPost | null>(null)
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()
        if (data.posts && data.posts.length > 0) {
          setLatestPost(data.posts[0])
          setRecentPosts(data.posts.slice(1, 3))
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left Panel */}
      <div className="w-1/2 bg-white dark:bg-gray-800 p-8 flex flex-col justify-between relative">
        {/* Logo */}
        <div className="text-6xl font-bold text-gray-900 dark:text-white">
          Deploy Diaries
        </div>
        
        {/* Vertical Text */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-widest">
            PUB | MODERNIST
          </span>
        </div>
        
        {/* Description */}
        <div className="max-w-md ml-16">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            A builder's notebook from the edge of the cloud. I document experiments, architectures, and lessons learned in the world of AWS — the good, the broken, and the beautifully optimized. Follow along as I turn trials into tutorials and concepts into code.
          </p>
        </div>
        
        {/* Cloud Deployment Animation */}
        <div className="flex justify-center mt-8">
          <div className="w-64 h-64 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
            {/* Cloud */}
            <div className="relative mb-8">
              <div className="w-16 h-10 bg-blue-400 rounded-full relative">
                <div className="absolute -left-2 top-2 w-6 h-6 bg-blue-400 rounded-full"></div>
                <div className="absolute -right-2 top-2 w-6 h-6 bg-blue-400 rounded-full"></div>
                <div className="absolute -top-1 left-3 w-10 h-5 bg-blue-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Deployment arrows - animated */}
            <div className="flex flex-col space-y-2">
              <div className="animate-pulse">
                <div className="w-1 h-8 bg-green-400 mx-auto"></div>
                <div className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-green-400 mx-auto"></div>
              </div>
            </div>
            
            {/* Servers/Containers */}
            <div className="flex space-x-2 mt-4">
              <div className="w-6 h-8 bg-gray-300 rounded animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="w-6 h-8 bg-gray-300 rounded animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="w-6 h-8 bg-gray-300 rounded animate-pulse" style={{animationDelay: '1.5s'}}></div>
            </div>
            
            {/* Status indicators */}
            <div className="flex space-x-1 mt-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" style={{animationDelay: '2.3s'}}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" style={{animationDelay: '2.6s'}}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel */}
      <div className="w-1/2 p-8">
        {/* Featured Article */}
        {latestPost ? (
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            {latestPost.previewImage && (
              <div className="w-full h-48 rounded-lg mb-6 overflow-hidden">
                <img 
                  src={latestPost.previewImage} 
                  alt={`Preview for ${latestPost.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {latestPost.title}
            </h1>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
              <span className="font-medium">{latestPost.author}</span>
              <span className="mx-2">•</span>
              <span>{new Date(latestPost.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              }).replace(',', '—')}</span>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {latestPost.excerpt || latestPost.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...'}
            </p>
            
            <Link 
              href={`/blog/${latestPost.slug}`}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Read more
            </Link>
          </article>
        ) : (
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No articles yet</p>
              <Link
                href="/write"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Write the first article
              </Link>
            </div>
          </article>
        )}
        
        {/* Additional Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentPosts.map((post, index) => (
            <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              {post.previewImage ? (
                <div className="w-full h-32 rounded mb-4 overflow-hidden">
                  <img 
                    src={post.previewImage} 
                    alt={`Preview for ${post.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : index === 1 && (
                <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-yellow-400 rounded mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full"></div>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {post.title}
              </h3>
              <Link 
                href={`/blog/${post.slug}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Read more
              </Link>
            </article>
          ))}
          
          {/* Fill empty slots if needed */}
          {recentPosts.length === 0 && (
            <>
              <article className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Minimalism in the Age of Excess: Aesthetic or Ideology?
                </h3>
                <Link 
                  href="/blog/minimalism" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Read more
                </Link>
              </article>
              
              <article className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-yellow-400 rounded mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Slow Thinking in a Fast World: Why Deep Reflection is a Radical Act
                </h3>
                <Link 
                  href="/blog/slow-thinking" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Read more
                </Link>
              </article>
            </>
          )}
        </div>
        
        {/* Blog Link */}
        <div className="mt-8 text-center">
          <Link 
            href="/blog" 
            className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            + BLOG
          </Link>
        </div>
      </div>
    </div>
  )
}
