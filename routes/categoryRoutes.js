const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getExpenseCategorySummary,
} = require("../controllers/categoryController");

router.get("/expense-summary", auth, getExpenseCategorySummary);

module.exports = router;
