'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Timeline from '../../components/Timeline';
import LoginModal from '../../components/LoginModal';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface BlogPost {
  id: string
  title: string
  author: string
  content: string
  excerpt?: string
  images?: string[]
  slug: string
  createdAt: string
  previewImage?: string; // Added previewImage to the interface
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [timelineSelection, setTimelineSelection] = useState<{ year: string; month: string } | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()
        setPosts(data.posts)
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
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Filter posts for All Articles based on timeline selection
  const filteredPosts = timelineSelection
    ? posts.filter(post => {
        const dateObj = new Date(post.createdAt);
        const year = dateObj.getFullYear().toString();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        return year === timelineSelection.year && month === timelineSelection.month;
      })
    : posts;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-3xl font-bold text-gray-900 dark:text-white">
                Deploy Diaries
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                A builder's notebook from the edge of the cloud.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <span className="text-gray-700 dark:text-gray-200 text-sm">{user.email}</span>
              ) : null}
              {/* Show Write Article and Manage Articles buttons only for the authorized user */}
              {user && user.email === 'jkang1643@gmail.com' && (
                <>
                  <button
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-base font-semibold transition-colors shadow-md"
                    onClick={() => window.location.href = '/manage'}
                  >
                    Manage Articles
                  </button>
                  <button
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-base font-semibold transition-colors shadow-md"
                    onClick={() => window.location.href = '/write'}
                  >
                    Write Article
                  </button>
                </>
              )}
              {user ? (
                <button
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-base font-semibold transition-colors shadow"
                  onClick={() => setShowLogin(true)}
                >
                  Logout
                </button>
              ) : (
                <button
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-base font-semibold transition-colors shadow-md"
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Recent Posts
        </h1>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No posts yet. Be the first to write an article!
            </p>
            {/* Removed Write First Article button */}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {posts.slice(0, 3).map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {post.previewImage ? (
                  <img
                    src={post.previewImage}
                    alt={post.title}
                    className="w-full h-48 object-cover object-center bg-gray-100 dark:bg-gray-900"
                  />
                ) : post.images && post.images.length > 0 ? (
                  <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                ) : null}
                
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span className="font-medium">{post.author}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {post.excerpt && (
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-4 h-24 overflow-hidden">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* All Articles Section with Timeline */}
        <section className="flex flex-col md:flex-row gap-8">
          <div className="md:w-3/4 w-full order-1 md:order-none">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-left">All Articles</h2>
            <div className="grid grid-cols-1 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id + '-all'}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {post.previewImage ? (
                    <img
                      src={post.previewImage}
                      alt={post.title}
                      className="w-full h-48 object-cover object-center bg-gray-100 dark:bg-gray-900"
                    />
                  ) : post.images && post.images.length > 0 ? (
                    <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                  ) : null}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span className="font-medium">{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    {post.excerpt && (
                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-4 h-24 overflow-hidden">
                        {post.excerpt}
                      </p>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
              {filteredPosts.length === 0 && (
                <div className="col-span-full text-gray-500 text-center py-8">No articles found for this month.</div>
              )}
            </div>
          </div>
          <aside className="md:w-1/4 w-full md:pl-8 order-2 md:order-none">
            <Timeline
              posts={posts}
              onSelect={(year, month) => setTimelineSelection({ year, month })}
              selected={timelineSelection}
            />
            {timelineSelection && (
              <button
                className="mt-2 text-xs text-gray-500 hover:underline"
                onClick={() => setTimelineSelection(null)}
              >
                Clear filter
              </button>
            )}
          </aside>
        </section>
      </main>
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onAuth={setUser}
        user={user}
      />
    </div>
  )
}