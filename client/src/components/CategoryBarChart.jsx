import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CATEGORY_LABELS } from '../utils/constants';

const CategoryBarChart = ({ data }) => {
  const chartData = data.map((item) => ({
    ...item,
    label: CATEGORY_LABELS[item.category] || item.category,
  }));

  if (!chartData.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">No data to display</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold">Spending by Category</h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value) => [`$${value.toFixed(2)}`, 'Total']}
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg, #fff)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryBarChart;
