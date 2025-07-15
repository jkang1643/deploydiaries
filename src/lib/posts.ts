export interface BlogPost {
  id: string
  title: string
  author: string
  date: string
  content: string
  excerpt?: string
  images?: string[]
  previewImage?: string
  slug: string
}

// Shared in-memory storage for blog posts
export const posts: BlogPost[] = [
  {
    id: '1',
    title: 'The Self in Fragments: How Digital Life Reshapes Our Sense of Identity',
    author: 'Joan Smith',
    date: '2025-04-01',
    content: '<p>Social media, algorithms, and digital spaces redefine who we are. This essay explores how our online selves shape—and sometimes distort—our real-world identities.</p><p>In the age of digital connectivity, our sense of self has become increasingly fragmented across multiple platforms, each demanding a different version of who we are...</p>',
    excerpt: 'Social media, algorithms, and digital spaces redefine who we are. This essay explores how our online selves shape—and sometimes distort—our real-world identities.',
    slug: 'digital-identity'
  },
  {
    id: '2', 
    title: 'Minimalism in the Age of Excess: Aesthetic or Ideology?',
    author: 'Alex Chen',
    date: '2025-03-28',
    content: '<p>As consumer culture reaches new heights, minimalism emerges as both design philosophy and lifestyle choice. But is it merely aesthetic preference or something deeper?</p>',
    excerpt: 'As consumer culture reaches new heights, minimalism emerges as both design philosophy and lifestyle choice.',
    slug: 'minimalism'
  },
  {
    id: '3',
    title: 'Slow Thinking in a Fast World: Why Deep Reflection is a Radical Act',
    author: 'Maya Patel',
    date: '2025-03-25',
    content: '<p>In an era of instant gratification and rapid decision-making, taking time to think deeply has become a radical act of resistance.</p>',
    excerpt: 'In an era of instant gratification and rapid decision-making, taking time to think deeply has become a radical act of resistance.',
    slug: 'slow-thinking'
  }
]