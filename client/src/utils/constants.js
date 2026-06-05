export const CATEGORIES = [
  'food',
  'transport',
  'entertainment',
  'bills',
  'other',
];

export const CATEGORY_LABELS = {
  food: 'Food',
  transport: 'Transport',
  entertainment: 'Entertainment',
  bills: 'Bills',
  other: 'Other',
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
