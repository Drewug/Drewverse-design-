// Mock Email Service
// In a real application, this would use SendGrid, Mailgun, or AWS SES

export const sendOrderConfirmation = async (email: string, orderId: string) => {
  console.log(`[EMAIL_SERVICE] Sending confirmation to ${email} for Order ${orderId}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return true;
};

export const sendAdminNotification = async (order: any) => {
  console.log(`[EMAIL_SERVICE] Sending admin alert for Order ${order.id} - Value: $${order.amount}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return true;
};