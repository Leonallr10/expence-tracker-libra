import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, CATEGORY_LABELS } from '../utils/constants';

const ExpenseList = ({ expenses, onDelete, deletingId }) => {
  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-600 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No expenses yet.</p>
        <Link
          to="/expenses/new"
          className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          Add your first expense
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense._id}
                className="border-b border-gray-100 dark:border-gray-700"
              >
                <td className="px-4 py-3">{expense.title}</td>
                <td className="px-4 py-3 capitalize">
                  {CATEGORY_LABELS[expense.category] || expense.category}
                </td>
                <td className="px-4 py-3">{formatDate(expense.date)}</td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/expenses/${expense._id}/edit`}
                    className="mr-3 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(expense._id)}
                    disabled={deletingId === expense._id}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50 dark:text-red-400"
                  >
                    {deletingId === expense._id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {expenses.map((expense) => (
          <div
            key={expense._id}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{expense.title}</p>
                <p className="text-sm capitalize text-gray-500 dark:text-gray-400">
                  {CATEGORY_LABELS[expense.category] || expense.category}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(expense.date)}
                </p>
              </div>
              <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(expense.amount)}
              </p>
            </div>
            <div className="mt-3 flex gap-3">
              <Link
                to={`/expenses/${expense._id}/edit`}
                className="text-sm text-indigo-600 dark:text-indigo-400"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => onDelete(expense._id)}
                disabled={deletingId === expense._id}
                className="text-sm text-red-600 disabled:opacity-50 dark:text-red-400"
              >
                {deletingId === expense._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ExpenseList;
