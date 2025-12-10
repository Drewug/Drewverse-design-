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
    const { email, password } = JSON.parse(event.body || '{}');

    // 1. In a real app, verify against Supabase Auth
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    // 2. Mock Logic for "DrewVerse" Demo
    if (email === 'admin@drewverse.com' && password === 'password') {
      const token = 'mock-jwt-token-' + Date.now();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          access_token: token,
          user: {
            id: 'admin-user-id',
            email: email,
            role: 'admin'
          }
        })
      };
    }

    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Invalid credentials' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};