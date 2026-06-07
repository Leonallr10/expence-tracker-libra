const { validationResult } = require('express-validator');
const prisma = require('../config/prisma');

const CATEGORIES = ['food', 'transport', 'entertainment', 'bills', 'other'];

const buildFilter = (userId, query) => {
  const filter = { userId };

  if (query.q) {
    filter.title = { contains: query.q, mode: 'insensitive' };
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.month) {
    const [year, month] = query.month.split('-').map(Number);
    if (year && month) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      filter.date = { gte: start, lt: end };
    }
  }

  return filter;
};

const getExpenses = async (req, res) => {
  try {
    const filter = buildFilter(req.user.id, req.query);
    const expenses = await prisma.expense.findMany({
      where: filter,
      orderBy: { date: 'desc' },
    });
    res.json(expenses);
  } catch (error) {
    console.error('Expense getExpenses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get total
    const totalResult = await prisma.expense.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    // Get by category
    const byCategory = await prisma.expense.groupBy({
      by: ['category'],
      where: { userId },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    // Get monthly data
    const expenses = await prisma.expense.findMany({
      where: { userId },
      select: { amount: true, date: true },
    });

    const monthlyMap = {};
    expenses.forEach((exp) => {
      const month = exp.date.toISOString().slice(0, 7);
      monthlyMap[month] = (monthlyMap[month] || 0) + exp.amount;
    });

    const monthly = Object.entries(monthlyMap)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => b.month.localeCompare(a.month));

    // Get recent expenses
    const recent = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
    });

    res.json({
      total: totalResult._sum.amount || 0,
      byCategory: byCategory.map((item) => ({
        category: item.category,
        total: item._sum.amount || 0,
      })),
      monthly,
      recent,
    });
  } catch (error) {
    console.error('Expense getSummary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createExpense = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const expense = await prisma.expense.create({
      data: {
        ...req.body,
        userId: req.user.id,
      },
    });
    res.status(201).json(expense);
  } catch (error) {
    console.error('Expense createExpense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateExpense = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const expense = await prisma.expense.updateMany({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      data: req.body,
    });

    if (expense.count === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const updatedExpense = await prisma.expense.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    res.json(updatedExpense);
  } catch (error) {
    console.error('Expense updateExpense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await prisma.expense.deleteMany({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });

    if (expense.count === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted' });
  } catch (error) {
    console.error('Expense deleteExpense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  CATEGORIES,
  getExpenses,
  getSummary,
  createExpense,
  updateExpense,
  deleteExpense,
};
