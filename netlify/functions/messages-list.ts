import { Handler } from '@netlify/functions';
import { supabase, headers } from './utils/db';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    // Check Auth Header (Mock validation)
    const authHeader = event.headers.authorization;
    if (!authHeader) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    // Fetch Messages
    // const { data, error } = await supabase.from('messages').select('*').order('date', { ascending: false });

    // Mock Data Return
    const mockMessages = [
      { id: '1', name: 'Alex Chen', email: 'alex@nietzsche.com', message: 'Need an MVP...', status: 'New', date: '2023-10-24' },
      { id: '2', name: 'Priya Kapoor', email: 'priya@luckycharm.io', message: 'Webflow migration...', status: 'Contacted', date: '2023-10-22' },
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockMessages)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch messages' })
    };
  }
};