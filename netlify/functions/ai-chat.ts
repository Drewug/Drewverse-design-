import { Handler } from '@netlify/functions';
import { GoogleGenAI } from "@google/genai";
import { headers } from './utils/db';

// Hardcoded context based on the mock data to give the AI "Brain" about the business
const AGENCY_CONTEXT = `
You are the AI Support Agent for "DrewVerse Design", a high-end web development agency run by Drew (Andrew).
Your tone is professional, concise, and helpful. You prefer short answers.

KEY INFORMATION:
- Founder: Andrew (10+ years experience, ex-Google, ex-Notion).
- Services: 
  1. MVP Development (React/Node.js) - Starts at $5k.
  2. Webflow Migration - Starts at $2k.
  3. Technical Audit - Free.
- Process: 6 Steps (Discovery, Planning, Design, Build, Test, Launch).
- Stack: React, Node.js, TypeScript, Supabase, Tailwind, Next.js.
- Contact: hello@drewverse.com.

RULES:
- If asked about pricing, quote the starting prices above.
- If asked to build something specific, suggest booking a consultation via the Contact form.
- Do not make up services not listed here.
- Keep responses under 50 words unless explaining a technical concept.
`;

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { message, history } = JSON.parse(event.body || '{}');

    if (!message) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Message is required' }) };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Construct the chat history for the model
    // We filter the history to match the Gemini format if necessary, 
    // but for simple context we can just feed the last few messages or use a Chat session.
    // Here we use generateContent with system instructions.
    
    // Format history for the prompt context if needed, or rely on the stateless nature with a strong system prompt
    // For a robust chat, we usually append history to the prompt or use the chat API. 
    // Let's use the chat API pattern:
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: AGENCY_CONTEXT,
      },
      history: history ? history.map((h: any) => ({
        role: h.role,
        parts: [{ text: h.text }]
      })) : []
    });

    const result = await chat.sendMessage({ message: message });
    const responseText = result.text;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: responseText })
    };

  } catch (error) {
    console.error('AI Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to generate response' })
    };
  }
};