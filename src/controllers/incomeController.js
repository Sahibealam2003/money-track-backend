//Income APIs
const Income = require("../models/incomeSchema");
const xlsx = require("xlsx");
const moment = require("moment");

//Add Income API
exports.addIncome = async (req, res) => {
  try {
    const userId = req.user._id;
    const { icon, source, amount, date } = req.body;

    if (!source || !amount) {
      return res.status(400).json({ error: "Source and amount are required" });
    }

    const newIncome = await Income.create({
      userId,
      icon: icon || "",
      source,
      amount: Number(amount),
      date: date ? new Date(date) : Date.now(),
    });

    res.status(200).json({
      message: "Income added successfully",
      income: newIncome,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

//Get all Income API
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Downlode xcel sheet of Income
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: moment(item.date).format("DD MMM YYYY"),
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    const buffer = xlsx.write(wb, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income_details.xlsx",
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Income transactions
exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
