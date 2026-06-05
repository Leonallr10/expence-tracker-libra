import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200'
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = user?.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link
          to="/"
          className="shrink-0 text-lg font-bold tracking-tight text-indigo-600 dark:text-indigo-400"
        >
          Expense Tracker
        </Link>

        <nav className="flex flex-1 flex-wrap items-center justify-center gap-1">
          <NavLink to="/" end className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/expenses" end className={navLinkClass}>
            Expenses
          </NavLink>
          <NavLink to="/expenses/new" className={navLinkClass}>
            Add Expense
          </NavLink>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <DarkModeToggle />
          <div className="hidden items-center gap-2 sm:flex">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
              aria-hidden="true"
            >
              {initial}
            </span>
            <span className="max-w-[8rem] truncate text-sm font-medium text-gray-700 dark:text-gray-300">
              {user?.name}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
