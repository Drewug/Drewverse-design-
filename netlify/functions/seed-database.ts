import { Handler } from '@netlify/functions';
import { supabase, headers } from './utils/db';

// Duplicated Mock Data for Server-Side Seeding
// This ensures the function is self-contained and doesn't rely on frontend build paths
const PROJECTS = [
  {
    title: 'Chronoswiss - Watch E-com',
    category: 'Frontend Development',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop',
    description: 'A high-performance e-commerce experience for luxury timepieces.'
  },
  {
    title: 'Scalable CMS for Donation Portal',
    category: 'Webflow CMS Dashboard',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
    description: 'Custom CMS solution handling thousands of concurrent users.'
  },
  {
    title: 'Architected MVP for Health Tech',
    category: 'HIPAA-compliant React/Node.js',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop',
    description: 'Secure, compliant, and user-friendly medical data interface.'
  },
  {
    title: 'Revamped Legacy Codebase',
    category: 'Refactoring',
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop',
    description: 'Refactored 10k+ lines of spaghetti code into modular architecture.'
  }
];

const BLOGS = [
  {
    date: '5 February 2025',
    readTime: '5 min read',
    title: 'How artificial intelligence is transforming industries in 2024',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop',
    isFeatured: true
  },
  {
    date: '5 February 2025',
    readTime: '5 min read',
    title: 'GitHub + Slack: How I Cut Agency Development Time by 40%',
    isFeatured: false
  },
  {
    date: '5 February 2025',
    readTime: '5 min read',
    title: 'MVP Development Mistakes Every First-Time Founder Makes',
    isFeatured: false
  }
];

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const results = {
      projects: { status: 'skipped', count: 0 },
      blogs: { status: 'skipped', count: 0 },
      errors: [] as string[]
    };

    // 1. Seed Projects
    // We use 'upsert' to avoid duplicates based on the 'title' column (assuming it's unique or we don't care about overwriting)
    // Note: In a real app, you'd want a proper unique constraint or ID.
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .upsert(PROJECTS.map(p => ({ ...p, updated_at: new Date() })), { onConflict: 'title' })
      .select();

    if (projectError) {
      console.error('Project Seed Error:', projectError);
      results.errors.push(`Projects: ${projectError.message}`);
    } else {
      results.projects = { status: 'success', count: projectData?.length || 0 };
    }

    // 2. Seed Blogs
    const { data: blogData, error: blogError } = await supabase
      .from('blogs')
      .upsert(BLOGS.map(b => ({ ...b, updated_at: new Date() })), { onConflict: 'title' })
      .select();

    if (blogError) {
      console.error('Blog Seed Error:', blogError);
      results.errors.push(`Blogs: ${blogError.message}`);
    } else {
      results.blogs = { status: 'success', count: blogData?.length || 0 };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Database seeding process completed',
        details: results
      })
    };

  } catch (error) {
    console.error('Seed Handler Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error during seeding' })
    };
  }
};