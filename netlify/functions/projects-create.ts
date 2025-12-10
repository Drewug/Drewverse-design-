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
    const projectData = JSON.parse(event.body || '{}');

    // Validation
    if (!projectData.title || !projectData.image) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Title and Image are required' })
      };
    }

    // Database Insert
    // const { data, error } = await supabase.from('projects').insert([projectData]).select();
    
    // Mock Response
    const newProject = {
      id: Math.random().toString(36).substr(2, 9),
      ...projectData,
      createdAt: new Date().toISOString()
    };

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: 'Project created successfully',
        data: newProject
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create project' })
    };
  }
};