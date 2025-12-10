import { Handler } from '@netlify/functions';

// Duplicate data because Netlify Functions isolated scope might not resolve React dependencies in mockData.ts
const SERVICES = [
  { 
    id: 'svc-1',
    title: "MVP Development Package", 
    price: "5000.00 USD",
    description: "Professional full-stack MVP development for startups. React, Node.js, Database included.",
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd",
    link: "https://drewverse.com/services#mvp"
  },
  { 
    id: 'svc-2',
    title: "Webflow Migration Service", 
    price: "2000.00 USD",
    description: "Migrate your existing site to Webflow. Pixel-perfect design and SEO setup.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    link: "https://drewverse.com/services#webflow"
  },
  { 
    id: 'svc-3',
    title: "Technical Code Audit", 
    price: "0.00 USD",
    description: "Free comprehensive review of your codebase security and performance.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    link: "https://drewverse.com/services#audit"
  }
];

export const handler: Handler = async (event) => {
  const platform = event.queryStringParameters?.platform || 'google';
  const siteUrl = process.env.URL || 'https://drewverse.com';

  let xmlContent = '';

  if (platform === 'pinterest' || platform === 'bing' || platform === 'google') {
    const items = SERVICES.map(item => `
    <item>
      <g:id>${item.id}</g:id>
      <g:title>${item.title}</g:title>
      <g:description>${item.description}</g:description>
      <g:link>${item.link}</g:link>
      <g:image_link>${item.image}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>${item.price}</g:price>
      <g:brand>DrewVerse</g:brand>
      <g:google_product_category>software > web design</g:google_product_category>
    </item>`).join('\n');

    xmlContent = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>DrewVerse Design Services</title>
<link>${siteUrl}</link>
<description>High-end web development services.</description>
${items}
</channel>
</rss>`;
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    },
    body: xmlContent
  };
};