const Expense = require('../models/Expense');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const CATEGORIES = ['food', 'transport', 'entertainment', 'bills', 'other'];

const buildFilter = (userId, query) => {
  const filter = { userId: new mongoose.Types.ObjectId(userId) };

  if (query.q) {
    filter.title = { $regex: query.q, $options: 'i' };
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.month) {
    const [year, month] = query.month.split('-').map(Number);
    if (year && month) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      filter.date = { $gte: start, $lt: end };
    }
  }

  return filter;
};

const getExpenses = async (req, res) => {
  try {
    const filter = buildFilter(req.user.id, req.query);
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const [totalResult, byCategory, monthly, recent] = await Promise.all([
      Expense.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Expense.aggregate([
        { $match: { userId } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $project: { _id: 0, category: '$_id', total: 1 } },
        { $sort: { total: -1 } },
      ]),
      Expense.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
            },
            total: { $sum: '$amount' },
          },
        },
        {
          $project: {
            _id: 0,
            month: {
              $concat: [
                { $toString: '$_id.year' },
                '-',
                {
                  $cond: {
                    if: { $lt: ['$_id.month', 10] },
                    then: { $concat: ['0', { $toString: '$_id.month' }] },
                    else: { $toString: '$_id.month' },
                  },
                },
              ],
            },
            total: 1,
          },
        },
        { $sort: { month: -1 } },
      ]),
      Expense.find({ userId }).sort({ date: -1 }).limit(5),
    ]);

    res.json({
      total: totalResult[0]?.total || 0,
      byCategory,
      monthly,
      recent,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createExpense = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const expense = await Expense.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateExpense = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted' });
  } catch (error) {
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
