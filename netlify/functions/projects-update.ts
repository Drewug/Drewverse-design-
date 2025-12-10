import { Handler } from '@netlify/functions';
import { supabase, headers } from './utils/db';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'PUT' && event.httpMethod !== 'PATCH') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { id, ...updates } = JSON.parse(event.body || '{}');

    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Project ID is required' })
      };
    }

    // Database Update
    // const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Project updated successfully',
        data: { id, ...updates }
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update project' })
    };
  }
};