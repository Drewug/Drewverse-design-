// Simple validation script for orders
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateOrder = (orderData: any): ValidationResult => {
  const errors: string[] = [];

  // Check required fields
  if (!orderData.customerEmail || !orderData.customerEmail.includes('@')) {
    errors.push('Invalid or missing customer email.');
  }

  if (!orderData.customerName || orderData.customerName.length < 2) {
    errors.push('Customer name is too short.');
  }

  if (!orderData.serviceId) {
    errors.push('Service ID is required.');
  }

  if (typeof orderData.amount !== 'number' || orderData.amount <= 0) {
    errors.push('Invalid order amount.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};