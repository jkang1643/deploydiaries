'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  Grid,
  Stack,
  Paper,
  IconButton,
  Fab,
  Tooltip,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material'
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Comment as CommentIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  AccessTime as AccessTimeIcon,
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
const CodeBlock = ({ children, className, ...props }: React.ComponentProps<'pre'>) => {
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
    <Box sx={{ position: 'relative', my: 3 }}>
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
          fontFamily: 'monospace',
          fontSize: '0.875rem',
        }}
      >
        <code {...props}>
          {children}
        </code>
      </Paper>
    </Box>
  )
}

// Custom Inline Code Component
const InlineCode = ({ children, ...props }: React.ComponentProps<'code'>) => {
  return (
    <Chip 
      label={children}
      size="small"
      sx={{ 
        height: 'auto',
        px: 0.5,
        py: 0.25,
        fontSize: '0.875rem',
        fontFamily: 'monospace',
        bgcolor: 'grey.100',
        color: 'text.primary',
      }}
      {...props}
    />
  )
}

// Article metadata component
const ArticleMeta = ({ author, date, readTime }: { author: string; date: string; readTime: number }) => (
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
  
  const contentInView = useInView(contentRef, { once: true, margin: "-100px" })
  const authorInView = useInView(authorRef, { once: true, margin: "-100px" })

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
      <Container maxWidth="md" sx={{ py: 6 }}>
        <motion.div
          ref={contentRef}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: contentInView ? 0 : 50, opacity: contentInView ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Article Meta */}
          <ArticleMeta 
            author={post.author}
            date={post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
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
          <Box sx={{ 
            '& .prose': {
              maxWidth: 'none',
              color: 'text.primary',
              lineHeight: 1.7,
              fontSize: '1.125rem',
            }
          }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight, rehypeSlug, rehypeAutolinkHeadings]}
              components={{
                h1: (props) => <Typography variant="h3" component="h1" sx={{ mt: 6, mb: 3, fontWeight: 700 }} {...props} />,
                h2: (props) => <Typography variant="h4" component="h2" sx={{ mt: 5, mb: 2, fontWeight: 600 }} {...props} />,
                h3: (props) => <Typography variant="h5" component="h3" sx={{ mt: 4, mb: 2, fontWeight: 600 }} {...props} />,
                p: (props) => <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.125rem' }} {...props} />,
                a: (props) => <Typography component="a" sx={{ color: 'secondary.main', textDecoration: 'underline', '&:hover': { color: 'secondary.dark' } }} {...props} />,
                img: (props) => (
                  <Box sx={{ my: 4, textAlign: 'center' }}>
                    <img 
                      {...props}
                      style={{ 
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                  </Box>
                ),
                pre: CodeBlock,
                code: InlineCode,
                blockquote: (props) => (
                  <Paper
                    sx={{
                      p: 3,
                      my: 3,
                      bgcolor: 'grey.50',
                      borderLeft: '4px solid',
                      borderColor: 'secondary.main',
                      fontStyle: 'italic',
                    }}
                    {...props}
                  />
                ),
                ul: (props) => <Box component="ul" sx={{ mb: 3, pl: 3 }} {...props} />,
                ol: (props) => <Box component="ol" sx={{ mb: 3, pl: 3 }} {...props} />,
                li: (props) => <Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }} {...props} />,
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
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: authorInView ? 0 : 50, opacity: authorInView ? 1 : 0 }}
            transition={{ duration: 0.6 }}
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
