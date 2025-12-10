import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pawomxxjuzjiybwxvfay.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhd29teHhqdXpqaXlid3h2ZmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjU4NjksImV4cCI6MjA4MDkwMTg2OX0.DnsVpsoMsttIi-lZAUHxniIsn2tmj_F0rdMOEix3KMU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);