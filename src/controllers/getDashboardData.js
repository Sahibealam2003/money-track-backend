//GET all deshboard Data (income, expenses, last 30 days transactions and last 60 day transactions)
const Income = require("../models/incomeSchema")
const Expense = require("../models/expreseSchema")
const { Types } = require("mongoose")

exports.getDashboardData = async (req, res) => {
  try {
    const userId = new Types.ObjectId(req.user._id)

    // TOTAL INCOME
    const totalIncome = await Income.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    // TOTAL EXPENSE
    const totalExpense = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    // LAST 60 DAYS INCOME
    const last60DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 })

    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    )

    // LAST 30 DAYS EXPENSE
    const last30DaysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 })

    const expensesLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    )

    // LAST 5 TRANSACTIONS
    const incomeTxns = (await Income.find({ userId }).sort({ date: -1 }).limit(5))
      .map(txn => ({ ...txn.toObject(), type: "income" }))

    const expenseTxns = (await Expense.find({ userId }).sort({ date: -1 }).limit(5))
      .map(txn => ({ ...txn.toObject(), type: "expense" }))

    const lastTransactions = [...incomeTxns, ...expenseTxns].sort(
      (a, b) => b.date - a.date
    )

    // FINAL RESPONSE
    res.status(200).json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),

      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpense[0]?.total || 0,

      last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      },

      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },

      recentTransactions: lastTransactions,
    })
  } catch (error) {
    res.status(500).json({
      message: "Dashboard data fetch failed",
      error: error.message,
    })
  }
}
