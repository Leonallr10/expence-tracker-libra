const { Router } = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  CATEGORIES,
  getExpenses,
  getSummary,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');

const router = Router();

const expenseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('date').isISO8601().withMessage('Valid date is required'),
];

router.use(auth);

router.get('/summary', getSummary);
router.get('/', getExpenses);
router.post('/', expenseValidation, createExpense);
router.put('/:id', expenseValidation, updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
