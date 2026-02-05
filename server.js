const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const logger = require("./utils/logger");
const http = require("http");
const { Server } = require("socket.io");
const sendEmail = require("./utils/sendEmail");
const categoryRoutes = require("./routes/categoryRoutes");

const cron = require("node-cron");

dotenv.config();
const app = express();
const PORT =  5000;
const server = http.createServer(app);

//  Connect to MongoDB
connectDB().catch((error) => {
  console.error("❌ MongoDB Connection Failed:", error);
  process.exit(1);
});

//  WebSocket Setup
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://financemanagers.netlify.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true, // Allow older socket.io clients
});

io.on("connection", (socket) => {
  console.log("🔗 New WebSocket Connection");

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"] ,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(logger);

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/income", require("./routes/incomeRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/category", categoryRoutes);

// CRON JOB - Check Due Bills & Send Email Notifications
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🔄 Checking for due bills...");

    const today = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(today.getDate() + 2);

    const dueBills = await DueBill.find({
      dueDate: { $lte: twoDaysLater, $gte: today },
    });

    if (dueBills.length > 0) {
      for (const bill of dueBills) {
        console.log(`📧 Sending reminder email for ${bill.name}`);
        await sendEmail(
          bill.userEmail,
          `Reminder: ${bill.name} Due Soon!`,
          `Your bill "${bill.name}" is due on ${bill.dueDate.toDateString()}. Please pay on time.`
        );

        //  Emit notification via WebSocket
        io.emit("dueBillNotification", {
          title: "Due Bill Reminder",
          message: `🚨 Your bill "${bill.name}" is due soon!`,
        });
      }
      console.log(`✅ Emails sent for ${dueBills.length} due bills.`);
    } else {
      console.log("✅ No due bills found.");
    }
  } catch (error) {
    console.error("❌ Error checking due bills:", error);
  }
});

//  Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
