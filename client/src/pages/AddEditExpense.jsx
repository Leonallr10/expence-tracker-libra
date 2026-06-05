import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createExpense, getExpenses, updateExpense } from '../api/expenses';
import ExpenseForm from '../components/ExpenseForm';

const AddEditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;

    const fetchExpense = async () => {
      try {
        const { data } = await getExpenses();
        const found = data.find((e) => e._id === id);
        if (!found) {
          setError('Expense not found');
        } else {
          setExpense(found);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load expense');
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id, isEdit]);

  const handleSubmit = async (formData) => {
    if (isEdit) {
      await updateExpense(id, formData);
    } else {
      await createExpense(formData);
    }
    navigate('/expenses');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
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

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">
        {isEdit ? 'Edit Expense' : 'Add Expense'}
      </h1>
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <ExpenseForm
          initialData={expense}
          onSubmit={handleSubmit}
          submitLabel={isEdit ? 'Update Expense' : 'Add Expense'}
        />
      </div>
    </div>
  );
};

export default AddEditExpense;
