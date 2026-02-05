const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    category: { type: String },
    date: { type: Date, required: true },
    division:{ type: String },
    description:{ type: String },
    
},{ timestamps: true });

module.exports = mongoose.model("Income", incomeSchema);
