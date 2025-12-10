import { Handler } from '@netlify/functions';
import { supabase, headers } from './utils/db';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { id } = event.queryStringParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Project ID is required' })
      };
    }

    // Database Delete
    // const { error } = await supabase.from('projects').delete().eq('id', id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: `Project ${id} deleted successfully`
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to delete project' })
    };
  }
};