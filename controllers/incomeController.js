const Income = require("../models/Income");

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

// 🔒 helper function
const canEditOrDelete = (createdAt) => {
  const now = new Date();
  return now - new Date(createdAt) <= TWELVE_HOURS;
};

// ✅ CREATE INCOME
exports.createIncome = async (req, res) => {
  try {
    const { amount, category, division, description } = req.body;

    const income = new Income({
      userId: req.user.id,
      amount,
      category,
      division,
      description,
    });

    await income.save();
    res.status(201).json(income);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ GET USER INCOME
exports.getIncome = async (req, res) => {
  try {
    const income = await Income.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔒 UPDATE INCOME (ONLY WITHIN 12 HOURS)
exports.updateIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    if (income.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!canEditOrDelete(income.createdAt)) {
      return res.status(403).json({
        message: "Income can only be edited within 12 hours",
      });
    }

    const { amount, category, division, description } = req.body;

    income.amount = amount ?? income.amount;
    income.category = category ?? income.category;
    income.division = division ?? income.division;
    income.description = description ?? income.description;

    await income.save();
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔒 DELETE INCOME (ONLY WITHIN 12 HOURS)
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    if (income.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!canEditOrDelete(income.createdAt)) {
      return res.status(403).json({
        message: "Income can only be deleted within 12 hours",
      });
    }

    await income.deleteOne();
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
