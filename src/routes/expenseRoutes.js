const express = require('express');
const route = express.Router();
const {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpenseExcel, // fixed spelling
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

route.post('/add', protect, addExpense);
route.get('/get', protect, getAllExpense);
route.get('/downloadexcel', protect, downloadExpenseExcel);
route.delete('/:id', protect, deleteExpense);

module.exports = route