import { ORDER_STATUS_LABELS } from '../constants/orderStatus';
import { DELIVERY_TYPE_LABELS, PAYMENT_METHOD_LABELS } from '../constants/deliveryTypes';

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount) => {
  return `₹${amount.toFixed(2)}`;
};

export const getStatusLabel = (status) => {
  return ORDER_STATUS_LABELS[status] || status;
};

export const getDeliveryTypeLabel = (type) => {
  return DELIVERY_TYPE_LABELS[type] || type;
};

export const getPaymentMethodLabel = (method) => {
  return PAYMENT_METHOD_LABELS[method] || method;
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};