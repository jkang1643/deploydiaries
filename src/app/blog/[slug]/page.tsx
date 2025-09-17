'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Avatar,
  Grid,
  Stack,
  Paper,
  IconButton,
  Fab,
  Tooltip,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material'
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Link as LinkIcon,
  Send as SendIcon,
} from '@mui/icons-material'
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
  previewImage?: string
}

interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
  replies?: Comment[]
}

// Estimated read time calculator
const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200
  const words = content.split(' ').length
  return Math.ceil(words / wordsPerMinute)
}

// Strip markdown formatting and return plain text for previews
const stripMarkdown = (markdown: string): string => {
  return markdown
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove lists
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove horizontal rules
    .replace(/^---+$/gm, '')
    // Remove extra whitespace and newlines
    .replace(/\n\s*\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Custom Code Block Component with Copy Functionality
const CodeBlock = ({ children, ...props }: React.ComponentProps<'pre'>) => {
  const [copied, setCopied] = useState(false)
  
  const copyToClipboard = async () => {
    try {
      const extractTextContent = (element: React.ReactNode): string => {
        if (typeof element === 'string') {
          return element
        }
        if (typeof element === 'number') {
          return String(element)
        }
        if (React.isValidElement(element)) {
          const reactElement = element as React.ReactElement
          const children = (reactElement.props as { children?: React.ReactNode })?.children
          if (Array.isArray(children)) {
            return children.map(extractTextContent).join('')
          }
          return extractTextContent(children)
        }
        return ''
      }
      
      const textToCopy = extractTextContent(children)
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <Box sx={{ position: 'relative', my: 3, width: '100%', maxWidth: '100%' }}>
      <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
        <Button
          onClick={copyToClipboard}
          size="small"
          variant="outlined"
          startIcon={copied ? <Check size={14} /> : <Copy size={14} />}
          sx={{
            minWidth: 'auto',
            px: 1.5,
            py: 0.5,
            fontSize: '0.75rem',
            bgcolor: 'background.paper',
            opacity: 0.8,
            '&:hover': { opacity: 1 },
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </Box>
      <Paper
        component="pre"
        sx={{
          p: 3,
          pt: 4,
          bgcolor: 'grey.50',
          border: '1px solid',
          borderColor: 'grey.200',
          borderRadius: 2,
          overflow: 'auto',
          overflowX: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          whiteSpace: 'pre',
          wordBreak: 'normal',
          overflowWrap: 'normal',
        }}
      >
        <code 
          {...props}
          style={{
            display: 'block',
            width: '100%',
            whiteSpace: 'pre',
            wordBreak: 'normal',
            overflowWrap: 'normal',
          }}
        >
          {children}
        </code>
      </Paper>
    </Box>
  )
}

// Custom Inline Code Component
const InlineCode = ({ children, ...props }: React.ComponentProps<'code'>) => {
  const codeRef = useRef<HTMLElement>(null)
  const [isBlockCode, setIsBlockCode] = useState(false)
  
  useEffect(() => {
    if (codeRef.current) {
      // Check if the code element is inside a pre tag
      const parentPre = codeRef.current.closest('pre')
      setIsBlockCode(!!parentPre)
    }
  }, [])
  
  // Always render as plain code element to avoid truncation issues
  // The styling will be handled by the parent CodeBlock component for block code
  return (
    <code 
      ref={codeRef}
      {...props}
      style={{
        display: isBlockCode ? 'block' : 'inline',
        width: isBlockCode ? '100%' : 'auto',
        whiteSpace: isBlockCode ? 'pre' : 'pre-wrap',
        wordBreak: 'normal',
        overflowWrap: 'normal',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        backgroundColor: isBlockCode ? 'transparent' : '#f5f5f5',
        padding: isBlockCode ? '0' : '2px 4px',
        borderRadius: isBlockCode ? '0' : '4px',
        border: isBlockCode ? 'none' : '1px solid #e0e0e0',
      }}
    >
      {children}
    </code>
  )
}

// Article metadata component
const ArticleMeta = ({ readTime }: { readTime: number }) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
      ARTICLE
    </Typography>
    <Typography variant="caption" color="text.secondary">
      •
    </Typography>
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
      {readTime} MINUTE READ
    </Typography>
  </Stack>
)

// Share component
const ShareSection = ({ title, url }: { title: string; url: string }) => {
  const [copied, setCopied] = useState(false)

  const shareOptions = [
    {
      name: 'Twitter',
      icon: TwitterIcon,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: '#1DA1F2'
    },
    {
      name: 'LinkedIn',
      icon: LinkedInIcon,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: '#0077B5'
    }
  ]

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link: ', err)
    }
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
        Share:
      </Typography>
      {shareOptions.map((option) => (
        <Tooltip key={option.name} title={`Share on ${option.name}`}>
          <IconButton
            size="small"
            component="a"
            href={option.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: option.color }}
          >
            <option.icon fontSize="small" />
          </IconButton>
        </Tooltip>
      ))}
      <Tooltip title={copied ? 'Copied!' : 'Copy link'}>
        <IconButton size="small" onClick={copyLink} sx={{ color: 'text.secondary' }}>
          <LinkIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  )
}

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

  const contentRef = useRef<HTMLDivElement>(null)
  const authorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.slug}`)
        if (!response.ok) {
          throw new Error('Post not found')
        }
        const data = await response.json()
        setPost(data.post)
        setLikeCount(Math.floor(Math.random() * 50) + 10) // Mock like count
      } catch {
        setError('Post not found')
      } finally {
        setLoading(false)
      }
    }

    const fetchRelatedPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()
        if (data.posts) {
          // Get 3 random posts excluding current one
          const filtered = data.posts.filter((p: BlogPost) => p.slug !== params.slug)
          setRelatedPosts(filtered.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching related posts:', error)
      }
    }

    if (params.slug) {
      fetchPost()
      fetchRelatedPosts()
    }
  }, [params.slug])

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
  }

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Anonymous',
        content: newComment,
        createdAt: new Date().toISOString(),
      }
      setComments(prev => [...prev, comment])
      setNewComment('')
    }
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">Loading...</Typography>
      </Box>
    )
  }

  if (error || !post) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 2 }}>Post Not Found</Typography>
          <Button component={Link} href="/blog" startIcon={<ArrowBackIcon />}>
            Back to Blog
          </Button>
        </Box>
      </Box>
    )
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ py: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Button
              component={Link}
              href="/blog"
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              sx={{ borderColor: 'grey.300' }}
            >
              Back to Blog
            </Button>
            
            <Button component={Link} href="/" variant="text" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
              Deploy Diaries
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Hero Image */}
      {post.previewImage && (
        <Box sx={{ height: { xs: 300, md: 400 }, overflow: 'hidden' }}>
          <motion.img
            src={post.previewImage}
            alt={post.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        </Box>
      )}

      {/* Article Content */}
      <Container maxWidth="md" sx={{ py: 6, px: { xs: 2, sm: 3, md: 4 }, overflow: 'visible' }}>
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Article Meta */}
          <ArticleMeta 
            readTime={calculateReadTime(post.content)}
          />

          {/* Title */}
          <Typography 
            variant="h1" 
            component="h1"
            sx={{ 
              mb: 4,
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '3rem' },
              lineHeight: 1.2,
            }}
          >
            {post.title}
          </Typography>

          {/* Author and Date */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 6 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ width: 48, height: 48 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {post.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ''}
                </Typography>
              </Box>
            </Stack>

            {/* Like and Share */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Fab
                  size="small"
                  onClick={handleLike}
                  sx={{
                    bgcolor: liked ? 'error.main' : 'grey.100',
                    color: liked ? 'white' : 'text.secondary',
                    '&:hover': {
                      bgcolor: liked ? 'error.dark' : 'grey.200',
                    },
                  }}
                >
                  {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </Fab>
              </motion.div>
              <Typography variant="body2" color="text.secondary">
                {likeCount}
              </Typography>
            </Stack>
          </Stack>

          {/* Content */}
          <Box 
            sx={{ 
              width: '100%',
              overflow: 'visible',
              '& p': {
                marginBottom: '1.5rem',
                lineHeight: 1.7,
                fontSize: '1.125rem',
                color: 'text.primary',
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                color: 'text.primary',
                fontWeight: 'bold',
                marginTop: '2rem',
                marginBottom: '1rem',
              },
              '& h1': { fontSize: '2.5rem' },
              '& h2': { fontSize: '2rem' },
              '& h3': { fontSize: '1.75rem' },
              '& h4': { fontSize: '1.5rem' },
              '& h5': { fontSize: '1.25rem' },
              '& h6': { fontSize: '1rem' },
              '& ul, & ol': {
                marginBottom: '1.5rem',
                paddingLeft: '1.5rem',
              },
              '& li': {
                marginBottom: '0.5rem',
                lineHeight: 1.6,
              },
              '& a': {
                color: 'primary.main',
                textDecoration: 'underline',
                '&:hover': {
                  color: 'primary.dark',
                },
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                margin: '2rem auto',
                display: 'block',
                borderRadius: '8px',
              },
              '& svg': {
                maxWidth: '100%',
                height: 'auto',
              },
              '& .mermaid': {
                maxWidth: '100%',
                overflow: 'auto',
              },
              '& blockquote': {
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                paddingLeft: '1.5rem',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                marginY: '2rem',
                backgroundColor: 'grey.50',
                fontStyle: 'italic',
                borderRadius: '0 8px 8px 0',
              },
              '& table': {
                width: '100%',
                borderCollapse: 'collapse',
                marginY: '2rem',
                '& th, & td': {
                  border: '1px solid',
                  borderColor: 'grey.300',
                  padding: '0.75rem',
                  textAlign: 'left',
                },
                '& th': {
                  backgroundColor: 'grey.100',
                  fontWeight: 'bold',
                },
              },
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight, rehypeSlug, rehypeAutolinkHeadings]}
              components={{
                h1: (props) => <h1 className="text-4xl mb-6 mt-10 text-black font-extrabold" style={{fontFamily: 'inherit'}} {...props} />, 
                h2: (props) => <h2 className="text-3xl mb-5 mt-8 text-gray-800 font-bold" style={{fontFamily: 'inherit'}} {...props} />, 
                h3: (props) => <h3 className="text-2xl mb-4 mt-6 text-gray-700 font-semibold" style={{fontFamily: 'inherit'}} {...props} />, 
                h4: (props) => <h4 className="text-base mb-1 mt-1 text-gray-600 font-medium" style={{fontFamily: 'inherit'}} {...props} />, 
                h5: (props) => <h5 className="text-sm mb-1 mt-1 text-gray-500 font-medium" style={{fontFamily: 'inherit'}} {...props} />, 
                h6: (props) => <h6 className="text-xs mb-1 mt-1 text-gray-400 font-medium uppercase tracking-wider" style={{fontFamily: 'inherit'}} {...props} />, 
                a: ({...props}) => <a className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors" {...props} />,
                img: ({src, alt, height, width, style}) => {
                  // Handle Blob URLs by using regular img element
                  if (src instanceof Blob) {
                    return (
                      <img 
                        src={URL.createObjectURL(src)}
                        alt={alt || ''}
                        height={height ? parseInt(height.toString()) : 400}
                        width={width ? parseInt(width.toString()) : 800}
                        style={style}
                        className="max-w-full rounded-lg shadow-md block mx-auto my-6" 
                      />
                    )
                  }
                  
                  // For string URLs, use Next.js Image component
                  return (
                    <Image 
                      src={src as string || ''} 
                      alt={alt || ''} 
                      height={height ? parseInt(height.toString()) : 400}
                      width={width ? parseInt(width.toString()) : 800}
                      style={style}
                      className="max-w-full rounded-lg shadow-md block mx-auto my-6" 
                    />
                  )
                },
                table: (props) => <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 my-4" {...props} />,
                thead: (props) => <thead className="bg-gray-50 dark:bg-gray-700" {...props} />,
                tbody: (props) => <tbody className="divide-y divide-gray-200 dark:divide-gray-600" {...props} />,
                tr: (props) => <tr className="hover:bg-gray-50 dark:hover:bg-gray-600" {...props} />,
                th: (props) => <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100" {...props} />,
                td: (props) => <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300" {...props} />,
                pre: CodeBlock,
                code: InlineCode,
                blockquote: (props) => (
                  <blockquote 
                    className="border-l-4 border-gray-300 dark:border-gray-600 pl-6 py-4 my-6 bg-gray-50 dark:bg-gray-800 rounded-r-lg italic text-gray-700 dark:text-gray-300 text-lg leading-relaxed" 
                    {...props}
                  />
                ),
                ul: (props) => <ul className="list-disc list-inside space-y-1 my-4 text-gray-700 dark:text-gray-300" {...props} />,
                ol: (props) => <ol className="list-decimal list-outside space-y-1 my-4 text-gray-700 dark:text-gray-300 ml-4" {...props} />,
                li: (props) => <li className="text-gray-700 dark:text-gray-300" {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </Box>

          {/* Share Section */}
          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
            <ShareSection title={post.title} url={currentUrl} />
          </Box>
        </motion.div>
      </Container>

      {/* Author Card */}
      <Box sx={{ py: 6, bgcolor: 'grey.50' }}>
        <Container maxWidth="md">
          <motion.div
            ref={authorRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'center', sm: 'flex-start' }}>
                <Avatar sx={{ width: 80, height: 80 }}>
                  <PersonIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {post.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Cloud Architect & Developer
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6 }}>
                    Passionate about building scalable, resilient systems in the AWS ecosystem. 
                    I share real stories behind the code—the victories, failures, and lessons learned.
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                    <Button size="small" variant="outlined">Follow</Button>
                    <Button size="small" variant="text">Contact</Button>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      {/* Comments Section */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
          Comments ({comments.length})
        </Typography>

        {/* Add Comment */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleCommentSubmit}
            disabled={!newComment.trim()}
          >
            Post Comment
          </Button>
        </Paper>

        {/* Comments List */}
        {comments.length > 0 ? (
          <List>
            {comments.map((comment) => (
              <ListItem key={comment.id} alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {comment.author}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {comment.content}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No comments yet. Be the first to share your thoughts!
          </Typography>
        )}
      </Container>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Box sx={{ py: 6, bgcolor: 'grey.50' }}>
          <Container maxWidth="lg">
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
              Related Articles
            </Typography>
            <Grid container spacing={4}>
              {relatedPosts.map((relatedPost, index) => (
                <Grid item xs={12} md={4} key={relatedPost.id}>
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      component={Link}
                      href={`/blog/${relatedPost.slug}`}
                      sx={{
                        height: '100%',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      {relatedPost.previewImage && (
                        <CardMedia
                          component="img"
                          height="160"
                          image={relatedPost.previewImage}
                          alt={relatedPost.title}
                        />
                      )}
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, lineHeight: 1.3 }}>
                          {relatedPost.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {relatedPost.excerpt || (stripMarkdown(relatedPost.content).substring(0, 100) + '...')}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}
    </Box>
  )
}
