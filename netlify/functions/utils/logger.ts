// Fallback Logger Utility
// Captures events and sends them to the database (or console in dev)

import { supabase } from './db';

type LogLevel = 'INFO' | 'WARNING' | 'ERROR';
type LogSource = 'ORDER_WORKER' | 'CRON_JOB' | 'EMAIL_SERVICE';

export const logEvent = async (level: LogLevel, source: LogSource, message: string, metadata?: any) => {
  const timestamp = new Date().toISOString();
  
  // 1. Console Log (Immediate feedback in Netlify Logs)
  console.log(`[${timestamp}] [${level}] [${source}]: ${message}`, metadata ? JSON.stringify(metadata) : '');

  // 2. Persist to Database (Simulated upsert for fallback logs)
  try {
    // In a real scenario, you'd have a 'system_logs' table
    // await supabase.from('system_logs').insert({ level, source, message, metadata, timestamp });
    
    // For demo purposes, we are just mocking the "safe" execution
    return true;
  } catch (error) {
    console.error('Failed to write log to DB', error);
    return false;
  }
};