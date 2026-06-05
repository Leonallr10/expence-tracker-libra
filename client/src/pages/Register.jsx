import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-1 dark:bg-gray-900 dark:text-gray-100 ${
      errors[field]
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600'
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-2 text-2xl font-bold">Create account</h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Start tracking your expenses today
        </p>

        {submitError && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setErrors({ ...errors, name: '' });
              }}
              className={inputClass('name')}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setErrors({ ...errors, email: '' });
              }}
              className={inputClass('email')}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                setErrors({ ...errors, password: '' });
              }}
              className={inputClass('password')}
              placeholder="At least 6 characters"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
