'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import React from 'react' // Added for React.Fragment
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { Copy, Check } from 'lucide-react'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github.css'

// Custom Code Block Component with Copy Functionality
const CodeBlock = ({ children, className, ...props }: React.ComponentProps<'pre'>) => {
  const [copied, setCopied] = useState(false)
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children as string)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="relative group my-6">
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className={`${className} bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-x-auto`}>
        <code className={`${className} bg-transparent`} {...props}>
          {children}
        </code>
      </pre>
    </div>
  )
}

// Custom Inline Code Component
const InlineCode = ({ children, ...props }: React.ComponentProps<'code'>) => {
  return (
    <code 
      className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono" 
      {...props}
    >
      {children}
    </code>
  )
}

interface BlogPost {
  id: string
  title: string
  author: string
  content: string
  excerpt?: string
  images?: string[]
  slug: string
  createdAt: string
  previewImage?: string
}

export default function Home() {
  const [latestPost, setLatestPost] = useState<BlogPost | null>(null)
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const aboutRef = useRef<HTMLDivElement | null>(null)

  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" })

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
    <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Blog Section */}
      <motion.div 
        className="min-h-screen flex items-stretch"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Left Panel */}
        <motion.div 
          className="w-1/2 bg-white dark:bg-gray-800 p-8 pb-12 flex flex-col justify-between relative h-screen"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Logo */}
          <motion.div 
            className="text-6xl font-bold text-gray-900 dark:text-white"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Deploy Diaries
          </motion.div>
        
        {/* Vertical Text */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-widest">
            PUB | MODERNIST
          </span>
        </div>
        
          {/* Description */}
          <motion.div 
            className="max-w-md ml-16"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              A builder&apos;s notebook from the edge of the cloud. I document experiments, architectures, and lessons learned in the world of AWS — the good, the broken, and the beautifully optimized. Follow along as I turn trials into tutorials and concepts into code.
            </p>
          </motion.div>
        
        {/* Compact, unified SVG for cloud, lines, pulses, and servers */}
        <div className="flex justify-center items-center mt-8 mb-4" style={{ minHeight: 260 }}>
          <svg
            width="300"
            height="220"
            viewBox="0 0 180 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block' }}
          >
            {/* Cloud shape at top center */}
            <g>
              <ellipse cx="90" cy="28" rx="36" ry="18" fill="url(#cloudGradient)" />
              <ellipse cx="72" cy="26" rx="14" ry="10" fill="url(#cloudGradient)" />
              <ellipse cx="108" cy="26" rx="14" ry="10" fill="url(#cloudGradient)" />
              <ellipse cx="90" cy="18" rx="18" ry="10" fill="url(#cloudGradient)" />
            </g>
            <defs>
              <linearGradient id="cloudGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e0e7ef" />
                <stop offset="100%" stopColor="#b6c3d1" />
              </linearGradient>
            </defs>
            {/* Lines from base of cloud (90,46) to server tops */}
            <line x1="90" y1="46" x2="30" y2="100" stroke="#d1d5db" strokeWidth="2" />
            <line x1="90" y1="46" x2="90" y2="100" stroke="#d1d5db" strokeWidth="2" />
            <line x1="90" y1="46" x2="150" y2="100" stroke="#d1d5db" strokeWidth="2" />
            {/* Pulses */}
            <circle className="cloud-pulse-svg cloud-pulse-svg-0" r="5" fill="#38bdf8" filter="url(#glow)" >
              <animate attributeName="cx" values="90;30" keyTimes="0;1" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="cy" values="46;100" keyTimes="0;1" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle className="cloud-pulse-svg cloud-pulse-svg-1" r="5" fill="#38bdf8" filter="url(#glow)">
              <animate attributeName="cx" values="90;90" keyTimes="0;1" dur="2.5s" repeatCount="indefinite" begin="0.3s" />
              <animate attributeName="cy" values="46;100" keyTimes="0;1" dur="2.5s" repeatCount="indefinite" begin="0.3s" />
            </circle>
            <circle className="cloud-pulse-svg cloud-pulse-svg-2" r="5" fill="#38bdf8" filter="url(#glow)">
              <animate attributeName="cx" values="90;150" keyTimes="0;1" dur="2.5s" repeatCount="indefinite" begin="0.6s" />
              <animate attributeName="cy" values="46;100" keyTimes="0;1" dur="2.5s" repeatCount="indefinite" begin="0.6s" />
            </circle>
            {/* Server boxes at endpoints */}
            <g>
              {/* Left server */}
              <rect x="12" y="100" width="36" height="20" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              {/* Center server */}
              <rect x="72" y="100" width="36" height="20" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              {/* Right server */}
              <rect x="132" y="100" width="36" height="20" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              {/* Minimal server grid icon for each */}
              {/* Left grid */}
              <g>
                <rect x="22" y="104" width="6" height="6" rx="1" fill="#d1d5db"/>
                <rect x="30" y="104" width="6" height="6" rx="1" fill="#d1d5db"/>
                <rect x="22" y="112" width="6" height="6" rx="1" fill="#d1d5db"/>
                <rect x="30" y="112" width="6" height="6" rx="1" fill="#d1d5db"/>
              </g>
              {/* Center grid */}
              <g>
                <rect x="82" y="104" width="6" height="6" rx="1" fill="#d1d5db"/>
                <rect x="90" y="104" width="6" height="6" rx="1" fill="#d1d5db"/>
                <rect x="82" y="112" width="6" height="6" rx="1" fill="#d1d5db"/>
                <rect x="90" y="112" width="6" height="6" rx="1" fill="#d1d5db"/>
              </g>
              {/* Right grid */}
              <g>
                <rect x="142" y="104" width="6" height="6" rx="1" fill="#d1d5db"/>
                <rect x="150" y="104" width="6" height="6" rx="1" fill="#d1d5db"/>
                <rect x="142" y="112" width="6" height="6" rx="1" fill="#d1d5db"/>
                <rect x="150" y="112" width="6" height="6" rx="1" fill="#d1d5db"/>
              </g>
            </g>
            <defs>
              <filter id="glow" x="-20" y="-20" width="60" height="60">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>
        </motion.div>
      
        {/* Right Panel */}
        <motion.div 
          className="w-1/2 p-8 pb-12"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Featured Article */}
          {latestPost ? (
            <motion.article 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
            {latestPost.previewImage && (
              <div className="w-full h-48 rounded-lg mb-6 overflow-hidden">
                <Image 
                  src={latestPost.previewImage} 
                  alt={`Preview for ${latestPost.title}`}
                  width={400}
                  height={192}
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
              <span>{new Date(latestPost.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              }).replace(',', '—')}</span>
            </div>
            
            {/* Markdown Preview for Featured Article */}
            <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 mb-2">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
                rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight, rehypeSlug, rehypeAutolinkHeadings]}
                  components={{
                    h1: ({...props}) => <h1 className="text-2xl mb-2 mt-2 text-black font-extrabold" style={{fontFamily: 'inherit'}} {...props} />, 
                    h2: ({...props}) => <h2 className="text-xl mb-1 mt-1 text-gray-800 font-bold" style={{fontFamily: 'inherit'}} {...props} />, 
                    h3: ({...props}) => <h3 className="text-lg mb-1 mt-1 text-gray-700 font-semibold" style={{fontFamily: 'inherit'}} {...props} />, 
                    h4: ({...props}) => <h4 className="text-base mb-1 mt-1 text-gray-600 font-medium" style={{fontFamily: 'inherit'}} {...props} />, 
                    h5: ({...props}) => <h5 className="text-sm mb-1 mt-1 text-gray-500 font-medium" style={{fontFamily: 'inherit'}} {...props} />, 
                    h6: ({...props}) => <h6 className="text-xs mb-1 mt-1 text-gray-400 font-medium uppercase tracking-wider" style={{fontFamily: 'inherit'}} {...props} />,
                    table: (props) => <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 my-4" {...props} />,
                    thead: (props) => <thead className="bg-gray-50 dark:bg-gray-700" {...props} />,
                    tbody: (props) => <tbody className="divide-y divide-gray-200 dark:divide-gray-600" {...props} />,
                    tr: (props) => <tr className="hover:bg-gray-50 dark:hover:bg-gray-600" {...props} />,
                    th: (props) => <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100" {...props} />,
                    td: (props) => <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300" {...props} />,
                    pre: CodeBlock,
                    code: InlineCode,
                    ul: (props) => <ul className="list-disc list-inside space-y-1 my-4 text-gray-700 dark:text-gray-300" {...props} />,
                    ol: (props) => <ol className="list-decimal list-inside space-y-1 my-4 text-gray-700 dark:text-gray-300" {...props} />,
                    li: (props) => <li className="text-gray-700 dark:text-gray-300" {...props} />,
                  }}
              >
                {(latestPost?.excerpt || latestPost?.content?.substring(0, 200) + '...') ?? ''}
              </ReactMarkdown>
            </div>
            
            <Link 
              href={`/blog/${latestPost.slug}`}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Read more
              </Link>
            </motion.article>
          ) : (
            <motion.article 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No articles yet</p>
              <Link
                href="/write"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Write the first article
              </Link>
              </div>
            </motion.article>
          )}
        
          {/* Additional Articles Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {recentPosts.map((post, index) => (
              <motion.article 
                key={post.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
              {post.previewImage && (
                <div className="w-full h-32 rounded mb-4 overflow-hidden">
                  <Image 
                    src={post.previewImage} 
                    alt={`Preview for ${post.title}`}
                    width={300}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {post.title}
              </h3>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span className="font-medium">{post.author}</span>
                <span className="mx-2">•</span>
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).replace(',', '—')}</span>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 mb-2 line-clamp-3 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
                  rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight, rehypeSlug, rehypeAutolinkHeadings]}
                  components={{
                    h1: ({...props}) => <h1 className="text-2xl mb-2 mt-2 text-black font-extrabold" style={{fontFamily: 'inherit'}} {...props} />, 
                    h2: ({...props}) => <h2 className="text-xl mb-1 mt-1 text-gray-800 font-bold" style={{fontFamily: 'inherit'}} {...props} />, 
                    h3: ({...props}) => <h3 className="text-lg mb-1 mt-1 text-gray-700 font-semibold" style={{fontFamily: 'inherit'}} {...props} />, 
                    h4: ({...props}) => <h4 className="text-base mb-1 mt-1 text-gray-600 font-medium" style={{fontFamily: 'inherit'}} {...props} />, 
                    h5: ({...props}) => <h5 className="text-sm mb-1 mt-1 text-gray-500 font-medium" style={{fontFamily: 'inherit'}} {...props} />, 
                    h6: ({...props}) => <h6 className="text-xs mb-1 mt-1 text-gray-400 font-medium uppercase tracking-wider" style={{fontFamily: 'inherit'}} {...props} />,
                    table: (props) => <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 my-4" {...props} />,
                    thead: (props) => <thead className="bg-gray-50 dark:bg-gray-700" {...props} />,
                    tbody: (props) => <tbody className="divide-y divide-gray-200 dark:divide-gray-600" {...props} />,
                    tr: (props) => <tr className="hover:bg-gray-50 dark:hover:bg-gray-600" {...props} />,
                    th: (props) => <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100" {...props} />,
                    td: (props) => <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300" {...props} />,
                    pre: CodeBlock,
                    code: InlineCode,
                    ul: (props) => <ul className="list-disc list-inside space-y-1 my-4 text-gray-700 dark:text-gray-300" {...props} />,
                    ol: (props) => <ol className="list-decimal list-inside space-y-1 my-4 text-gray-700 dark:text-gray-300" {...props} />,
                    li: (props) => <li className="text-gray-700 dark:text-gray-300" {...props} />,
                  }}
                >
                  {(post.excerpt || post.content?.substring(0, 200) + '...') ?? ''}
                </ReactMarkdown>
              </div>
              <Link 
                href={`/blog/${post.slug}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Read more
                </Link>
              </motion.article>
            ))}
          
            {/* Fill empty slots if needed */}
            {recentPosts.length === 0 && (
              <>
                <motion.article 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Minimalism in the Age of Excess: Aesthetic or Ideology?
                  </h3>
                  <Link 
                    href="/blog/minimalism" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Read more
                  </Link>
                </motion.article>
              
                <motion.article 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
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
                </motion.article>
              </>
            )}
          </motion.div>
        
          {/* Blog Link */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/blog" 
                className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                + BLOG
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* About Section - Apple Style */}
      <motion.div 
        ref={aboutRef}
        className="min-h-screen bg-white dark:bg-black flex items-center justify-center relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: aboutInView ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black opacity-50"></div>
        
        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: aboutInView ? 0 : 100, opacity: aboutInView ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-6xl md:text-8xl font-thin text-gray-900 dark:text-white mb-8">
              About
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: aboutInView ? 0 : 100, opacity: aboutInView ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <p className="text-2xl md:text-3xl font-light text-gray-700 dark:text-gray-300 leading-relaxed">
              Building the future,<br />
              one deployment at a time.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                I&apos;m a cloud architect and developer passionate about creating scalable, 
                resilient systems in the AWS ecosystem. My journey spans from startup 
                experimentation to enterprise-grade infrastructure.
              </p>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Through Deploy Diaries, I share the real stories behind the code—the 
                victories, the failures, and the lessons learned in between. Every post 
                is a glimpse into the iterative process of building something meaningful.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: aboutInView ? 0 : 100, opacity: aboutInView ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 flex flex-wrap justify-center gap-8"
          >
            {['AWS', 'Serverless', 'DevOps', 'Infrastructure as Code', 'Microservices'].map((skill, index) => (
              <motion.div
                key={skill}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 font-medium"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: aboutInView ? 1 : 0, opacity: aboutInView ? 1 : 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {skill}
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: aboutInView ? 0 : 50, opacity: aboutInView ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full text-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Get in touch
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-4 h-4 bg-blue-500 rounded-full opacity-20"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
        <motion.div
          className="absolute bottom-32 right-32 w-6 h-6 bg-green-500 rounded-full opacity-20"
          animate={{ 
            y: [0, -30, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            repeatType: "loop",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/2 right-20 w-3 h-3 bg-purple-500 rounded-full opacity-20"
          animate={{ 
            x: [0, -15, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            repeatType: "loop",
            delay: 2
          }}
        />
      </motion.div>
    </div>
  )
}
