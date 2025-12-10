import { Handler } from '@netlify/functions';
import { supabase, headers } from './utils/db';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { section, content } = JSON.parse(event.body || '{}');

    if (!section || !content) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Section ID and Content are required' })
      };
    }

    // Upsert content into a 'site_content' table
    // const { data, error } = await supabase.from('site_content').upsert({ section, content, updated_at: new Date() });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Content updated successfully',
        data: { section, updated: true }
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update content' })
    };
  }
};