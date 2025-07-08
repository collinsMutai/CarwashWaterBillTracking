require("dotenv").config(); // Load env vars from .env
const mongoose = require("mongoose");
const Payment = require("./models/Payment"); // Adjust path if needed

async function createYesterdayPayment() {
  try {
    // Connect to MongoDB using MONGO_URI from .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Set date to yesterday at midnight
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    // Payment data for yesterday
    const paymentData = {
      date: yesterday,
      cashPaid: 250,
      waterUnits: 1, // 1 unit = 600 KES water cost
      balance: 250 - 600, // -350 balance (owner owes 350)
      services: [], // no vehicle wash services
    };

    // Check if a payment already exists for yesterday
    let payment = await Payment.findOne({ date: yesterday });
    if (payment) {
      console.log("Payment for yesterday already exists:", payment);
    } else {
      payment = new Payment(paymentData);
      await payment.save();
      console.log("Payment for yesterday created:", payment);
    }
  } catch (err) {
    console.error("Error creating payment:", err);
  } finally {
    await mongoose.disconnect();
  }
}

createYesterdayPayment();
