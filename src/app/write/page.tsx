'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import Editor from '@/components/Editor';

export default function WritePage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'jkang1643@gmail.com') {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        router.replace('/blog');
      }
      setChecked(true);
    });
    return () => unsubscribe();
  }, [router]);

  if (!checked) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">Checking authorization...</div>;
  }

  if (!authorized) {
    return null; // Will redirect
  }

  return <Editor mode="create" />;
}