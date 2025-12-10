import { Handler } from '@netlify/functions';
import { GoogleGenAI, Type } from "@google/genai";
import { headers } from './utils/db';

const PROPOSAL_CONTEXT = `
You are a Senior Agency Director writing a project proposal for a client.
Your tone is professional, confident, and persuasive.
Structure the proposal using Markdown with the following sections:
1. **Executive Summary**: A brief understanding of the client's needs.
2. **Scope of Work**: Bullet points of what will be delivered.
3. **Timeline**: Estimated duration (e.g., 4-6 weeks) and phases.
4. **Investment**: Pricing breakdown based on the input budget.
5. **Next Steps**: Call to action.
`;

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { clientName, projectType, budget, goals } = JSON.parse(event.body || '{}');

    if (!clientName) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Client Name is required' }) };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Write a proposal for:
      Client: ${clientName}
      Project Type: ${projectType}
      Budget: ${budget || 'To be discussed'}
      Goals/Notes: ${goals || 'Standard implementation'}

      The agency name is "DrewVerse Design".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: PROPOSAL_CONTEXT,
        // We want unstructured Markdown text, so no JSON schema here
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ proposal: response.text })
    };

  } catch (error) {
    console.error('AI Proposal Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to generate proposal' })
    };
  }
};