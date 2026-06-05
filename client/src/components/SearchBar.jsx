const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="search"
      placeholder="Search expenses..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:w-64"
    />
  );
};

export default SearchBar;
