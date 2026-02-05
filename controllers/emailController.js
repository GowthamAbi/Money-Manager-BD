const nodemailer = require("nodemailer");
const Expenserecurring = require("../models/Expenserecurring");

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,  // Your email
        pass: process.env.EMAIL_PASS   // Your email password (Use App Password)
    }
});

//  Function to send email reminders
const sendDueBillReminder = async () => {
    try {
        const today = new Date();
        today.setDate(today.getDate() + 2);

        const dueExpenses = await Expenserecurring.find({ nextDue: { $lte: today } });

        for (const expense of dueExpenses) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: "gowtham2131ece@gmail.com",
                subject: `Reminder: Your ${expense.category} bill is due soon`,
                text: `Hello, your ${expense.category} expense of ₹${expense.amount} is due on ${new Date(expense.nextDue).toLocaleDateString()}.`
            };

            await transporter.sendMail(mailOptions);
            console.log(`📧 Email sent for ${expense.category}`);
        }
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};


const cron = require("node-cron");
cron.schedule("0 0 * * *", sendDueBillReminder); 

module.exports = { sendDueBillReminder };
