const StatCard = ({ title, value, subtitle }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      )}
    </div>
  );
};

export default StatCard;
