import { createClient } from '@supabase/supabase-js';

// The URL from your screenshot
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://pawomxxjuzjiybwxvfay.supabase.co';

// NOTE: You must set SUPABASE_SERVICE_KEY in Netlify Site Settings > Environment Variables
// Get this from Supabase Dashboard > Project Settings > API > service_role key
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'sb_secret_SRc9lkQeE_QRgeXhoGhXdw_uGfOJYib';

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};