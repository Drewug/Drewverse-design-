import { Handler } from '@netlify/functions';
import { headers, supabase } from './utils/db';
import { validateOrder } from './utils/validation';
import { sendOrderConfirmation, sendAdminNotification } from './utils/email';
import { logEvent } from './utils/logger';

// automated-order-handling worker
export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Allow POST trigger (e.g., from Stripe webhook or Frontend checkout)
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  const requestId = Math.random().toString(36).substring(7);

  try {
    const payload = JSON.parse(event.body || '{}');
    
    // 1. Log Incoming Request
    await logEvent('INFO', 'ORDER_WORKER', `Received order request: ${requestId}`);

    // 2. Validation Script
    const validation = validateOrder(payload);
    if (!validation.isValid) {
      await logEvent('ERROR', 'ORDER_WORKER', `Validation failed for req ${requestId}`, { errors: validation.errors });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Validation failed', details: validation.errors })
      };
    }

    // 3. Process Order (Forwarding Script)
    // Simulate forwarding to fulfillment system or creating DB record
    const newOrder = {
      id: `ORD-${Date.now()}`,
      ...payload,
      status: 'PROCESSING',
      createdAt: new Date().toISOString()
    };

    // Mock DB Save
    // await supabase.from('orders').insert(newOrder);
    
    // 4. Send Email Notifications
    await Promise.all([
      sendOrderConfirmation(newOrder.customerEmail, newOrder.id),
      sendAdminNotification(newOrder)
    ]);

    // 5. Log Success
    await logEvent('INFO', 'ORDER_WORKER', `Order ${newOrder.id} processed successfully.`);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ message: 'Order processed', orderId: newOrder.id })
    };

  } catch (error) {
    // 6. Fallback Logs
    await logEvent('ERROR', 'ORDER_WORKER', `CRITICAL FAILURE in req ${requestId}`, { error: String(error) });
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal processing error' })
    };
  }
};