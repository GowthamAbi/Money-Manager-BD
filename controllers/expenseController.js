const Expense = require("../models/Expense");

const TWELVE_HOURS = 12 * 60 * 60 * 1000;


exports.addExpense = async (req, res) => {
  try {
    const { amount, category, description ,date} = req.body;

    const expense = new Expense({
      userId: req.user.id,
      amount,
      category,
      description,date
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error("❌ Error adding expense:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(expenses);
  } catch (err) {
    console.error("❌ Error fetching expenses:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✏ UPDATE expense (within 12 hours)
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense)
      return res.status(404).json({ message: "Expense not found" });

    if (expense.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    // 🔥 FIX: fallback to date
    const createdTime = expense.createdAt || expense.date;

    if (new Date() - new Date(createdTime) > TWELVE_HOURS)
      return res.status(403).json({
        message: "Expense can only be edited within 12 hours",
      });

    Object.assign(expense, req.body);
    await expense.save();

    res.json(expense);
  } catch (err) {
    console.error("❌ Error updating expense:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🗑 DELETE expense (within 12 hours)
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense)
      return res.status(404).json({ message: "Expense not found" });

    if (expense.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    // 🔥 FIX: fallback to date
    const createdTime = expense.createdAt || expense.date;

    if (new Date() - new Date(createdTime) > TWELVE_HOURS)
      return res.status(403).json({
        message: "Expense can only be deleted within 12 hours",
      });

    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting expense:", err);
    res.status(500).json({ message: "Server error" });
  }
};
