import { formatCurrency, formatDate, CATEGORY_LABELS } from '../utils/constants';

const RecentExpenses = ({ expenses }) => {
  if (!expenses?.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold">Recent Transactions</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">No recent transactions.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <h2 className="border-b border-gray-200 px-6 py-4 text-lg font-semibold dark:border-gray-700">
        Recent Transactions
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense._id}
                className="border-t border-gray-100 dark:border-gray-700"
              >
                <td className="px-6 py-3">{expense.title}</td>
                <td className="px-6 py-3 capitalize">
                  {CATEGORY_LABELS[expense.category] || expense.category}
                </td>
                <td className="px-6 py-3">{formatDate(expense.date)}</td>
                <td className="px-6 py-3 text-right font-medium">
                  {formatCurrency(expense.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentExpenses;
