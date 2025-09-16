'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
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
  Divider,
} from '@mui/material'
import { 
  AccessTime as AccessTimeIcon,
  ArrowForward as ArrowForwardIcon,
  Person as PersonIcon,
} from '@mui/icons-material'

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

// Article metadata component
const ArticleMeta = ({ author, date, readTime }: { author: string; date: string; readTime: number }) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
    <Typography variant="caption" color="text.secondary">
      ARTICLE
    </Typography>
    <Typography variant="caption" color="text.secondary">
      •
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {readTime} MINUTE READ
    </Typography>
  </Stack>
)

export default function Home() {
  const [latestPost, setLatestPost] = useState<BlogPost | null>(null)
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [visiblePosts, setVisiblePosts] = useState(6)
  
  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" })
  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()
        if (data.posts && data.posts.length > 0) {
          setLatestPost(data.posts[0])
          setRecentPosts(data.posts.slice(1, 3))
          setAllPosts(data.posts)
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    fetchPosts()
  }, [])

  const loadMorePosts = () => {
    setVisiblePosts(prev => prev + 6)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        ref={heroRef}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: heroInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          component={motion.div}
          style={{ y }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            opacity: 0.5,
          }}
        />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={8} alignItems="center" sx={{ minHeight: '80vh' }}>
            {/* Left Side - Hero Content */}
            <Grid item xs={12} lg={6}>
              <Box
                component={motion.div}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: heroInView ? 0 : -100, opacity: heroInView ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Typography 
                  variant="h1" 
                  component="h1"
                  sx={{ 
                    mb: 3,
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                    lineHeight: { xs: 1.2, md: 1.1 },
                    background: 'linear-gradient(135deg, #0D1117 0%, #374151 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Deploy Diaries
                </Typography>
                
                <Typography 
                  variant="h4" 
                  component="h2"
                  color="text.secondary"
                  sx={{ 
                    mb: 4,
                    fontWeight: 400,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    lineHeight: 1.4,
                  }}
                >
                  A builder's notebook from the edge of the cloud
                </Typography>
                
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    mb: 6,
                    fontSize: '1.125rem',
                    lineHeight: 1.6,
                    maxWidth: '500px',
                  }}
                >
                  I document experiments, architectures, and lessons learned in the world of AWS — 
                  the good, the broken, and the beautifully optimized.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={Link}
                    href="/blog"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    }}
                  >
                    Explore Articles
                  </Button>
                  
                  <Button
                    component={Link}
                    href="/about"
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      borderColor: 'grey.300',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.main',
                        color: 'white',
                      },
                    }}
                  >
                    About
                  </Button>
                </Stack>
              </Box>
            </Grid>

            {/* Right Side - Featured Article */}
            <Grid item xs={12} lg={6}>
              <Box
                component={motion.div}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: heroInView ? 0 : 100, opacity: heroInView ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {latestPost ? (
                  <Card
                    component={motion.div}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    sx={{
                      height: '100%',
                      maxHeight: '600px',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid',
                      borderColor: 'grey.200',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {latestPost.previewImage && (
                      <CardMedia
                        component="img"
                        height="280"
                        image={latestPost.previewImage}
                        alt={latestPost.title}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    
                    <CardContent sx={{ flexGrow: 1, p: 4 }}>
                      <ArticleMeta 
                        author={latestPost.author}
                        date={new Date(latestPost.createdAt).toLocaleDateString()}
                        readTime={calculateReadTime(latestPost.content)}
                      />
                      
                      <Typography 
                        variant="h4" 
                        component="h3"
                        sx={{ 
                          mb: 2,
                          fontWeight: 700,
                          fontSize: { xs: '1.5rem', md: '2rem' },
                          lineHeight: 1.3,
                        }}
                      >
                        {latestPost.title}
                      </Typography>
                      
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                        <Avatar sx={{ width: 24, height: 24 }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          {latestPost.author}
                        </Typography>
                      </Stack>
                      
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ 
                          mb: 3,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.6,
                        }}
                      >
                        {latestPost.excerpt || (stripMarkdown(latestPost.content).substring(0, 200) + '...')}
                      </Typography>
                      
                      <Button
                        component={Link}
                        href={`/blog/${latestPost.slug}`}
                        variant="text"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          color: 'secondary.main',
                          fontWeight: 600,
                          p: 0,
                          '&:hover': {
                            bgcolor: 'transparent',
                            color: 'secondary.dark',
                          },
                        }}
                      >
                        Read Article
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Paper
                    sx={{
                      p: 6,
                      textAlign: 'center',
                      height: '400px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      border: '2px dashed',
                      borderColor: 'grey.300',
                    }}
                  >
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                      No articles yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      The first article is coming soon...
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Recent Articles Section */}
      <Container maxWidth="xl" sx={{ py: 12 }}>
        <Box
          component={motion.div}
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography 
            variant="h2" 
            component="h2"
            sx={{ 
              mb: 2,
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            Recent Articles
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              mb: 6,
              textAlign: 'center',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Exploring the latest in cloud architecture, serverless computing, and developer experiences
          </Typography>
        </Box>

        {allPosts.length > 0 ? (
          <Grid container spacing={4}>
            {allPosts.slice(0, visiblePosts).map((post, index) => (
              <Grid item xs={12} md={6} lg={4} key={post.id}>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid',
                      borderColor: 'grey.200',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        borderColor: 'grey.300',
                      },
                    }}
                    component={Link}
                    href={`/blog/${post.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {post.previewImage && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={post.previewImage}
                        alt={post.title}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <ArticleMeta 
                        author={post.author}
                        date={new Date(post.createdAt).toLocaleDateString()}
                        readTime={calculateReadTime(post.content)}
                      />
                      
                      <Typography 
                        variant="h5" 
                        component="h3"
                        sx={{ 
                          mb: 2,
                          fontWeight: 600,
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {post.title}
                      </Typography>
                      
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <Avatar sx={{ width: 20, height: 20 }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          {post.author}
                        </Typography>
                      </Stack>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.5,
                        }}
                      >
                        {post.excerpt || (stripMarkdown(post.content).substring(0, 150) + '...')}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No articles available yet
            </Typography>
          </Box>
        )}

        {/* Load More Button */}
        {allPosts.length > visiblePosts && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              onClick={loadMorePosts}
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                borderColor: 'grey.300',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.main',
                  color: 'white',
                },
              }}
            >
              Load More Articles
            </Button>
          </Box>
        )}
      </Container>

      {/* About Section */}
      <Box
        ref={aboutRef}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: aboutInView ? 1 : 0 }}
        transition={{ duration: 1 }}
        sx={{
          py: 12,
          bgcolor: 'grey.50',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: aboutInView ? 0 : -50, opacity: aboutInView ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Typography 
                  variant="h2" 
                  component="h2"
                  sx={{ 
                    mb: 4,
                    fontWeight: 700,
                  }}
                >
                  Building the future,<br />
                  one deployment at a time.
                </Typography>
                
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    mb: 4,
                    fontSize: '1.125rem',
                    lineHeight: 1.6,
                  }}
                >
                  I'm a cloud architect and developer passionate about creating scalable, 
                  resilient systems in the AWS ecosystem. Through Deploy Diaries, I share 
                  the real stories behind the code—the victories, failures, and lessons learned.
                </Typography>

                <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ mb: 4 }}>
                  {['AWS', 'Serverless', 'DevOps', 'Infrastructure as Code'].map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: aboutInView ? 1 : 0, opacity: aboutInView ? 1 : 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    >
                      <Chip 
                        label={skill} 
                        sx={{ 
                          bgcolor: 'white',
                          color: 'text.primary',
                          fontWeight: 500,
                        }} 
                      />
                    </motion.div>
                  ))}
                </Stack>

                <Button
                  component={Link}
                  href="/contact"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  Get in Touch
                </Button>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: aboutInView ? 0 : 50, opacity: aboutInView ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Paper
                  sx={{
                    p: 6,
                    bgcolor: 'white',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Recent Focus Areas
                  </Typography>
                  
                  <Stack spacing={3}>
                    {[
                      { title: 'Serverless Architecture', desc: 'Building scalable applications with AWS Lambda and API Gateway' },
                      { title: 'Infrastructure as Code', desc: 'Automating deployments with CloudFormation and CDK' },
                      { title: 'DevOps Practices', desc: 'CI/CD pipelines and monitoring strategies' },
                    ].map((item, index) => (
                      <Box key={item.title}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.desc}
                        </Typography>
                        {index < 2 && <Divider sx={{ mt: 2 }} />}
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
