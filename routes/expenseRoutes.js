const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

// CREATE
router.post("/", auth, addExpense);

// READ
router.get("/", auth, getExpenses);

// UPDATE (🔥 THIS WAS MISSING)
router.put("/:id", auth, updateExpense);

// DELETE (🔥 THIS WAS MISSING)
router.delete("/:id", auth, deleteExpense);

module.exports = router;
