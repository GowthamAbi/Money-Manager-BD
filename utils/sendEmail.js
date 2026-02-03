const nodemailer = require("nodemailer");
const {Expenserecurring} = require("../models/Expense");
const dotenv = require("dotenv");

dotenv.config(); // Load email credentials

// ✅ Create email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ Function to send reminder emails
const sendDueBillReminder = async () => {
    try {
        const today = new Date();
        today.setDate(today.getDate() + 2); // ✅ Get expenses due in 2 days

        const dueExpenses = await Expenserecurring.find({ nextDue: { $lte: today } });

        for (const expense of dueExpenses) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: "gowtham2131ece@gmail.com", // Replace with actual user email
                subject: `Reminder: ${expense.category} bill is due soon`,
                text: `Hello, your ${expense.category} expense of ₹${expense.amount} is due on ${new Date(expense.nextDue).toLocaleDateString()}.`
            };

            await transporter.sendMail(mailOptions);
            console.log(`📧 Email sent for ${expense.category}`);
        }
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

module.exports = { sendDueBillReminder };
