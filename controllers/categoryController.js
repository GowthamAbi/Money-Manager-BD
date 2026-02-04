const Expense = require("../models/Expense");
const mongoose = require("mongoose");

exports.getExpenseCategorySummary = async (req, res) => {
  try {
    const { period = "monthly" } = req.query;
    const userId = req.user.id;

    let startDate = new Date();

    if (period === "weekly") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "monthly") {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === "yearly") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const summary = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId), // 🔥 FIX
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json(summary);
  } catch (err) {
    console.error("❌ Category summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
