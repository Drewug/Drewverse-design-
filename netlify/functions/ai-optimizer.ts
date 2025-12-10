import { Handler } from '@netlify/functions';
import { GoogleGenAI, Type } from "@google/genai";
import { headers } from './utils/db';

const OPTIMIZER_CONTEXT = `
You are a top-tier E-commerce SEO Specialist for Google Merchant Center and Pinterest.
Your goal is to rewrite service package titles and descriptions to maximize Click-Through Rate (CTR) and Search Visibility in product feeds.

PLATFORM RULES:
- Google Shopping: Front-load vital keywords (e.g., "React MVP Development" not "Development Service"). Max 150 chars for title.
- Pinterest: Inspirational, benefit-driven, hashtag-friendly.
- Bing: Similar to Google but allows for slightly more professional/B2B phrasing.

OUTPUT:
Return strictly JSON.
`;

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { title, description, category, platform } = JSON.parse(event.body || '{}');

    if (!title) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Title is required' }) };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Optimize this service for ${platform} Product Feed.
      Original Title: "${title}"
      Original Description: "${description}"
      Category: "${category}"

      Return a JSON object with:
      1. optimizedTitle: A rewritten, high-ranking title.
      2. optimizedDescription: A keyword-rich description (min 150 chars).
      3. keywords: A list of 5 target keywords used.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: OPTIMIZER_CONTEXT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedTitle: { type: Type.STRING },
            optimizedDescription: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    return {
      statusCode: 200,
      headers,
      body: response.text
    };

  } catch (error) {
    console.error('AI Optimizer Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to optimize content' })
    };
  }
};