'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface Article {
  id: number;
  title: string;
  author: string;
  content: string;
  slug: string;
  createdAt: string;
}

export default function ManagePage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);


  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'jkang1643@gmail.com') {
        setAuthorized(true);
        setCurrentUser(user);
      } else {
        setAuthorized(false);
        setCurrentUser(null);
        router.replace('/blog');
      }
      setChecked(true);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (authorized) {
      fetchArticles();
    }
  }, [authorized]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setArticles(data.posts || []);
    } catch {
      setError('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const getIdToken = async () => {
    if (!currentUser) return null;
    return await currentUser.getIdToken();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const token = await getIdToken();
      if (!token) throw new Error('No ID token');
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setArticles(articles.filter(a => a.id !== id));
      } else {
        setError('Failed to delete article');
      }
    } catch {
      setError('Failed to delete article');
    }
  };

  const handleEdit = (article: Article) => {
    router.push(`/write/${article.id}`);
  };



  if (!checked) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">Checking authorization...</div>;
  }

  if (!authorized) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Manage Articles</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading ? (
          <div className="text-gray-600 dark:text-gray-300">Loading articles...</div>
        ) : articles.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-300">No articles found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="py-2 px-3 border-b">Title</th>
                <th className="py-2 px-3 border-b">Author</th>
                <th className="py-2 px-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id} className="border-b">
                  <td className="py-2 px-3 align-top">
                    <span>{article.title}</span>
                  </td>
                  <td className="py-2 px-3 align-top">
                    <span>{article.author}</span>
                  </td>
                  <td className="py-2 px-3 align-top space-x-2">
                    <button
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                      onClick={() => handleEdit(article)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                      onClick={() => handleDelete(article.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 