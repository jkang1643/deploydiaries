This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Environment Variables Required for Vercel Deployment

Make sure to set these environment variables in your Vercel project settings:

#### Database
- `DATABASE_URL`: Your PostgreSQL connection string
- `DIRECT_URL`: Direct PostgreSQL connection string (same as DATABASE_URL for most cases)

#### Firebase
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase app ID

#### Firebase Admin (for server-side authentication)
- `FIREBASE_SERVICE_ACCOUNT`: The entire contents of your Firebase service account JSON file (as a single line)

### Deployment Steps

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set all the environment variables listed above
4. Deploy!

The build process will automatically:
- Generate the Prisma client
- Build the Next.js application
- Deploy to Vercel's edge network

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


Remove this in production: 

it is a temporary memora

// ... existing code ...
    // TEMPORARY MEMORY SAFEGUARD: Limit in-memory posts to 100 for stability.
    // Remove this block when switching to a real database or after testing.
    if (posts.length > 100) posts.pop();
// ... existing code ...

// ... existing code ...
    posts.unshift(newPost);
    // TEMPORARY MEMORY SAFEGUARD: Only keep the latest 3 posts in memory to prevent WSL crashes. Remove when using a real database.
    while (posts.length > 3) posts.pop();
// ... existing code ...




Add a new environment variable:
Name: FIREBASE_SERVICE_ACCOUNT
Value: Paste the entire contents of your service account JSON (as a single line, or use a JSON minifier).