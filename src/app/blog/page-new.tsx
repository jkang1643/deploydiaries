'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import {
  Search as SearchIcon,
  Person as PersonIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material'
import Timeline from '../../components/Timeline'
import LoginModal from '../../components/LoginModal'
import { auth } from '../../lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'

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

// Article metadata component
const ArticleMeta = ({ author, date, readTime }: { author: string; date: string; readTime: number }) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [timelineSelection, setTimelineSelection] = useState<{ year: string; month: string } | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [visiblePosts, setVisiblePosts] = useState(9)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()
        setPosts(data.posts)
        setFilteredPosts(data.posts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })
    return () => unsubscribe()
  }, [])

  // Filter posts based on search and timeline
  useEffect(() => {
    let filtered = posts

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by timeline selection
    if (timelineSelection) {
      filtered = filtered.filter(post => {
        const dateObj = new Date(post.createdAt)
        const year = dateObj.getFullYear().toString()
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
        return year === timelineSelection.year && month === timelineSelection.month
      })
    }

    setFilteredPosts(filtered)
  }, [posts, searchQuery, timelineSelection])

  const loadMorePosts = () => {
    setVisiblePosts(prev => prev + 9)
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">Loading...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ py: 4, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
            <Box>
              <Typography 
                component={Link}
                href="/"
                variant="h3" 
                sx={{ 
                  fontWeight: 800,
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Deploy Diaries
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                A builder's notebook from the edge of the cloud
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2}>
              {user && user.email === 'jkang1643@gmail.com' && (
                <>
                  <Button
                    component={Link}
                    href="/manage"
                    variant="outlined"
                    sx={{ borderColor: 'secondary.main', color: 'secondary.main' }}
                  >
                    Manage Articles
                  </Button>
                  <Button
                    component={Link}
                    href="/write"
                    variant="contained"
                    sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                  >
                    Write Article
                  </Button>
                </>
              )}
              <Button
                variant={user ? 'outlined' : 'contained'}
                onClick={() => setShowLogin(true)}
                sx={user ? {} : { bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
              >
                {user ? 'Logout' : 'Login'}
              </Button>
            </Stack>
          </Stack>

          {/* Search and View Controls */}
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={3} 
            alignItems={{ xs: 'stretch', md: 'center' }}
            justifyContent="space-between"
          >
            <TextField
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                minWidth: { md: 300 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="grid">
                <ViewModuleIcon />
              </ToggleButton>
              <ToggleButton value="list">
                <ViewListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Posts */}
          <Grid item xs={12} lg={9}>
            <Stack spacing={4}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {searchQuery || timelineSelection ? 'Filtered' : 'All'} Articles
                  <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 2 }}>
                    ({filteredPosts.length})
                  </Typography>
                </Typography>
                
                {(searchQuery || timelineSelection) && (
                  <Button
                    variant="text"
                    onClick={() => {
                      setSearchQuery('')
                      setTimelineSelection(null)
                    }}
                    sx={{ color: 'text.secondary' }}
                  >
                    Clear filters
                  </Button>
                )}
              </Stack>

              {filteredPosts.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    {posts.length === 0 ? 'No articles yet' : 'No articles found'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {posts.length === 0 
                      ? 'Be the first to write an article!' 
                      : 'Try adjusting your search or filter criteria.'
                    }
                  </Typography>
                </Paper>
              ) : (
                <>
                  <Grid container spacing={viewMode === 'grid' ? 4 : 0}>
                    {filteredPosts.slice(0, visiblePosts).map((post, index) => (
                      <Grid item xs={12} md={viewMode === 'grid' ? 6 : 12} lg={viewMode === 'grid' ? 4 : 12} key={post.id}>
                        <motion.div
                          initial={{ y: 50, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          viewport={{ once: true }}
                          whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        >
                          <Card
                            component={Link}
                            href={`/blog/${post.slug}`}
                            sx={{
                              height: '100%',
                              display: 'flex',
                              flexDirection: viewMode === 'list' ? 'row' : 'column',
                              textDecoration: 'none',
                              color: 'inherit',
                              border: '1px solid',
                              borderColor: 'grey.200',
                              transition: 'all 0.3s ease',
                              minHeight: viewMode === 'grid' ? 420 : 'auto',
                              '&:hover': {
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                borderColor: 'grey.300',
                              },
                            }}
                          >
                            <Box
                              sx={{
                                height: viewMode === 'grid' ? 200 : 160,
                                width: viewMode === 'list' ? 240 : '100%',
                                flexShrink: 0,
                                overflow: 'hidden',
                                backgroundColor: 'grey.100',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {post.previewImage ? (
                                <Box
                                  component="img"
                                  src={post.previewImage}
                                  alt={post.title}
                                  sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                  }}
                                />
                              ) : (
                                <Typography 
                                  variant="body1" 
                                  color="text.primary"
                                  sx={{ 
                                    fontWeight: 500,
                                    opacity: 0.6,
                                    fontSize: '0.9rem',
                                  }}
                                >
                                  No Image
                                </Typography>
                              )}
                            </Box>
                            
                            <CardContent 
                              sx={{ 
                                flexGrow: 1, 
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                              }}
                            >
                              <Box sx={{ flexGrow: 1 }}>
                                <ArticleMeta 
                                  author={post.author}
                                  date={new Date(post.createdAt).toLocaleDateString()}
                                  readTime={calculateReadTime(post.content)}
                                />
                                
                                <Typography 
                                  variant={viewMode === 'grid' ? 'h6' : 'h5'}
                                  component="h3"
                                  sx={{ 
                                    mb: 2,
                                    fontWeight: 600,
                                    lineHeight: 1.3,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    minHeight: viewMode === 'grid' ? '3.2em' : 'auto',
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
                                    WebkitLineClamp: viewMode === 'grid' ? 3 : 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    lineHeight: 1.5,
                                    mb: 2,
                                    minHeight: viewMode === 'grid' ? '4.5em' : 'auto',
                                  }}
                                >
                                  {post.excerpt || (stripMarkdown(post.content).substring(0, 150) + '...')}
                                </Typography>
                              </Box>

                              <Button
                                variant="text"
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                  color: 'secondary.main',
                                  fontWeight: 600,
                                  p: 0,
                                  justifyContent: 'flex-start',
                                  alignSelf: 'flex-start',
                                  mt: 'auto',
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
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Load More Button */}
                  {filteredPosts.length > visiblePosts && (
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
                </>
              )}
            </Stack>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={3}>
            <Stack spacing={4}>
              {/* Timeline */}
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Browse by Date
                </Typography>
                <Timeline
                  posts={posts}
                  onSelect={(year, month) => setTimelineSelection({ year, month })}
                  selected={timelineSelection}
                />
                {timelineSelection && (
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setTimelineSelection(null)}
                    sx={{ mt: 2, color: 'text.secondary' }}
                  >
                    Clear filter
                  </Button>
                )}
              </Paper>

              {/* Recent Articles */}
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Recent Articles
                </Typography>
                <Stack spacing={2}>
                  {posts.slice(0, 3).map((post) => (
                    <Box key={post.id}>
                      <Typography
                        component={Link}
                        href={`/blog/${post.slug}`}
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          textDecoration: 'none',
                          color: 'inherit',
                          display: 'block',
                          mb: 0.5,
                          '&:hover': { color: 'primary.main' },
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>

              {/* Newsletter Signup */}
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'secondary.main', color: 'white' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Stay Updated
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  Get notified when new articles are published.
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your email"
                  size="small"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      borderRadius: 1,
                    },
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: 'white',
                    color: 'secondary.main',
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                >
                  Subscribe
                </Button>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onAuth={setUser}
        user={user}
      />
    </Box>
  )
}
