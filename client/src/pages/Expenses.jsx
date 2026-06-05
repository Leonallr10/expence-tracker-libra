import { useCallback, useEffect, useState } from 'react';
import { deleteExpense, getExpenses } from '../api/expenses';
import ExpenseList from '../components/ExpenseList';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.q = search;
      if (category) params.category = category;
      if (month) params.month = month;
      const { data } = await getExpenses(params);
      setExpenses(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [search, category, month]);

  useEffect(() => {
    const timer = setTimeout(fetchExpenses, 300);
    return () => clearTimeout(timer);
  }, [fetchExpenses]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    setDeletingId(id);
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete expense');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Expenses</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Search and filter your transactions
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter value={category} onChange={setCategory} />
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading expenses...</p>
      ) : (
        <ExpenseList
          expenses={expenses}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}
    </div>
  );
};

export default Expenses;
