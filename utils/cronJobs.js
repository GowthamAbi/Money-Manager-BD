const cron = require("node-cron");
const { sendDueBillReminder } = require("./sendEmail");


cron.schedule("0 0 * * *", () => {
    console.log("⏳ Running daily email reminder job...");
    sendDueBillReminder();
});
