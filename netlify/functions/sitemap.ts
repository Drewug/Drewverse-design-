import { Handler } from '@netlify/functions';

// Mock data import (in a real app, import from db or shared mock file)
const PAGES = ['home', 'about', 'services', 'portfolio', 'contact'];
const BLOG_IDS = ['1', '2', '3']; // IDs from mockData
const PROJECT_ids = ['1', '2', '3', '4']; // IDs from mockData

export const handler: Handler = async (event) => {
  const baseUrl = process.env.URL || 'https://drewverse.com';
  const currentDate = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Static Pages
  PAGES.forEach(page => {
    const priority = page === 'home' ? '1.0' : '0.8';
    const url = page === 'home' ? baseUrl : `${baseUrl}/${page}`;
    xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>
`;
  });

  // Dynamic Blog Posts
  BLOG_IDS.forEach(id => {
    xml += `  <url>
    <loc>${baseUrl}/blog/${id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  });

  // Dynamic Projects
  PROJECT_ids.forEach(id => {
    xml += `  <url>
    <loc>${baseUrl}/portfolio/${id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  });

  xml += `</urlset>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400' // Cache for 1 day
    },
    body: xml
  };
};