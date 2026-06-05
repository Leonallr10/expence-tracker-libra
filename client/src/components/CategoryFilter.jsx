import { CATEGORIES, CATEGORY_LABELS } from '../utils/constants';

const CategoryFilter = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
    >
      <option value="">All categories</option>
      {CATEGORIES.map((cat) => (
        <option key={cat} value={cat}>
          {CATEGORY_LABELS[cat]}
        </option>
      ))}
    </select>
  );
};

export default CategoryFilter;
