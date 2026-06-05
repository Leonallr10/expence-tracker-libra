import { useState } from 'react';
import { CATEGORIES, CATEGORY_LABELS } from '../utils/constants';

const validateForm = (form) => {
  const errors = {};

  if (!form.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!form.amount) {
    errors.amount = 'Amount is required';
  } else if (isNaN(form.amount) || Number(form.amount) <= 0) {
    errors.amount = 'Amount must be a positive number';
  } else if (!/^\d+(\.\d{1,2})?$/.test(form.amount)) {
    errors.amount = 'Amount can have at most 2 decimal places';
  }

  if (!form.category) {
    errors.category = 'Category is required';
  }

  if (!form.date) {
    errors.date = 'Date is required';
  }

  return errors;
};

const ExpenseForm = ({ initialData, onSubmit, submitLabel = 'Save Expense' }) => {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    amount: initialData?.amount?.toString() || '',
    category: initialData?.category || '',
    date: initialData?.date
      ? new Date(initialData.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setSubmitError('');
    try {
      await onSubmit({
        title: form.title.trim(),
        amount: parseFloat(form.amount),
        category: form.category,
        date: new Date(form.date).toISOString(),
      });
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-gray-100 ${
      errors[field]
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {submitError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {submitError}
        </div>
      )}

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          className={inputClass('title')}
          placeholder="e.g. Grocery shopping"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="amount" className="mb-1 block text-sm font-medium">
          Amount
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          value={form.amount}
          onChange={handleChange}
          className={inputClass('amount')}
          placeholder="0.00"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          className={inputClass('category')}
        >
          <option value="">Select category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="mb-1 block text-sm font-medium">
          Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className={inputClass('date')}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-500">{errors.date}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 sm:w-auto"
      >
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default ExpenseForm;
