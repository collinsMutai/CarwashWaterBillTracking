require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const vehicleRoutes = require("./routes/vehicle.routes");
const waterBillRoutes = require("./routes/waterBill.routes");
const paymentRoutes = require("./routes/payment.routes");
const authMiddleware = require("./middleware/auth.middleware");

const startWeeklySummaryCron = require("./weeklySummaryCron");

// Import mongoose and schema for second DB to save summary manually
const mongooseSecondary = require("mongoose");
const weeklySummarySchema = require("./models/WeeklySummary.model");

// App and port
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to primary DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Connect to second DB (for saving weekly summaries)
const secondDb = mongooseSecondary.createConnection(
  process.env.SECOND_MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
secondDb.on("connected", () =>
  console.log("✅ Second DB connected for summaries")
);
secondDb.on("error", (err) => console.error("❌ Second DB error:", err));

// Attach WeeklySummary model
const WeeklySummary = secondDb.model("WeeklySummary", weeklySummarySchema);

// Middleware: Configure CORS to allow requests from your frontend only
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", authMiddleware, vehicleRoutes);
app.use("/api/waterbills", authMiddleware, waterBillRoutes);
app.use("/api/payments", authMiddleware, paymentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚿 Car Wash Water Bill Backend Running");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  startWeeklySummaryCron(); // Cron job runs weekly summary every Monday 10 PM
});
