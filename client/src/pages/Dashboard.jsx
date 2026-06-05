import { useEffect, useState } from 'react';
import { getSummary } from '../api/expenses';
import { formatCurrency } from '../utils/constants';
import StatCard from '../components/StatCard';
import RecentExpenses from '../components/RecentExpenses';
import CategoryBarChart from '../components/CategoryBarChart';
import CategoryPieChart from '../components/CategoryPieChart';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await getSummary();
        setSummary(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
        {error}
      </div>
    );
  }

  const currentMonth = summary.monthly[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Overview of your spending
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary.total)}
          subtitle="All time"
        />
        {currentMonth && (
          <StatCard
            title="This Month"
            value={formatCurrency(currentMonth.total)}
            subtitle={currentMonth.month}
          />
        )}
        <StatCard
          title="Categories"
          value={summary.byCategory.length}
          subtitle="Active spending categories"
        />
      </div>

      {summary.monthly.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold">Monthly Breakdown</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summary.monthly.slice(0, 6).map((item) => (
              <div
                key={item.month}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-900"
              >
                <span className="text-sm font-medium">{item.month}</span>
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryBarChart data={summary.byCategory} />
        <CategoryPieChart data={summary.byCategory} />
      </div>

      <RecentExpenses expenses={summary.recent} />
    </div>
  );
};

export default Dashboard;
