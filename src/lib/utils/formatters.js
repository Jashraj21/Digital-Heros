export { formatDate, formatDateTime, formatMonthYear } from './dates';

export function formatCurrency(amount, currency = 'INR') {
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

export function formatCompactCurrency(amount, currency = 'INR') {
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(numericAmount);
}

export function formatPercentage(percentage) {
  const numericVal = typeof percentage === 'number' ? percentage : parseFloat(percentage) || 0;
  return `${numericVal.toFixed(0)}%`;
}

export function formatNumber(num) {
  const numericVal = typeof num === 'number' ? num : parseInt(num, 10) || 0;
  return new Intl.NumberFormat('en-IN').format(numericVal);
}
