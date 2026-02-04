const mongoose = require("mongoose");

// ✅ Expense Schema (One-Time Expenses)
const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    category: { type: String, required: true },
    description: { type: String }
},{ timestamps: true });


// ✅ Export both models properly
const Expense = mongoose.model("Expense", expenseSchema);


module.exports =  Expense;
