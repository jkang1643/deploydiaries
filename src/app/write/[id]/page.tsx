"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Editor from "@/components/Editor";
import type { FC } from "react";

interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
  slug: string;
  createdAt: string;
  previewImage?: string;
}

export default function EditWritePage() {
  const router = useRouter();
  const params = useParams();
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [post, setPost] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "jkang1643@gmail.com") {
        setAuthorized(true);
        setCurrentUser(user);
      } else {
        setAuthorized(false);
        setCurrentUser(null);
        router.replace("/blog");
      }
      setChecked(true);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (authorized && params.id) {
      fetchPost();
    }
    // eslint-disable-next-line
  }, [authorized, params.id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch post");
      const data = await res.json();
      setPost(data.post);
    } catch (err) {
      setError("Failed to fetch post");
    } finally {
      setLoading(false);
    }
  };

  const getIdToken = async () => {
    if (!currentUser) return null;
    return await currentUser.getIdToken();
  };

  const handleSave = async ({ title, author, content, previewImage }: { title: string; author: string; content: string; previewImage?: string }) => {
    try {
      const token = await getIdToken();
      if (!token) throw new Error("No ID token");
      const res = await fetch(`/api/posts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          author,
          content,
          previewImage: previewImage || null,
          slug: post?.slug || undefined,
        }),
      });
      if (res.ok) {
        router.push("/manage");
      } else {
        setError("Failed to update post");
      }
    } catch (err) {
      setError("Failed to update post");
    }
  };

  if (!checked) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">Checking authorization...</div>;
  }

  if (!authorized) {
    return null; // Will redirect
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">Loading post...</div>;
  }

  if (error || !post) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error || "Post not found"}</div>;
  }

  return (
    <Editor
      mode="edit"
      title={post?.title}
      author={post?.author}
      content={post?.content}
      previewImage={post?.previewImage}
      onSave={handleSave}
    />
  );
} 