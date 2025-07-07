require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const vehicleRoutes = require("./routes/vehicle.routes");
const waterBillRoutes = require("./routes/waterBill.routes");
const paymentRoutes = require("./routes/payment.routes");
const authMiddleware = require("./middleware/auth.middleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/vehicles", authMiddleware, vehicleRoutes);
app.use("/api/waterbills", authMiddleware, waterBillRoutes);
app.use("/api/payments", authMiddleware, paymentRoutes);

app.get("/", (req, res) => {
  res.send("Car Wash Water Bill Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
