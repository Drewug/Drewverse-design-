import { Handler } from '@netlify/functions';
import { GoogleGenAI, Type } from "@google/genai";
import { headers } from './utils/db';

const SEO_CONTEXT = `
You are an SEO Expert. 
Your task is to generate optimized Meta Tags and JSON-LD Schema Markup for a web page.
Focus on high CTR, relevant keywords for "Web Development Agency", and correct Schema.org syntax.
`;

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { pageName, contentSummary } = JSON.parse(event.body || '{}');

    if (!pageName) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Page Name is required' }) };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Generate SEO assets for a page named: "${pageName}".
      Context/Content: "${contentSummary || 'General web development agency page'}".

      Return a JSON object with:
      1. metaTitle: Optimized title tag (max 60 chars).
      2. metaDescription: Optimized meta description (max 160 chars).
      3. keywords: Comma-separated list of 5 keywords.
      4. schema: A stringified JSON-LD object appropriate for this page (e.g., WebPage, Service, Article).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SEO_CONTEXT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metaTitle: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            keywords: { type: Type.STRING },
            schema: { type: Type.STRING }
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
    console.error('AI SEO Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to generate SEO data' })
    };
  }
};