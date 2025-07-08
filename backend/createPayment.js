require("dotenv").config();
const mongoose = require("mongoose");
const Payment = require("./models/Payment");

async function createTodayPayment() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const yesterdayPayment = await Payment.findOne({ date: yesterday });
    const previousBalance = yesterdayPayment
      ? yesterdayPayment.balance || 0
      : 0;

    const additionalCashPaid = 200;
    const additionalWaterUnits = 0;

    const existing = await Payment.findOne({ date: today });

    if (existing) {
      // Merge into today's payment
      existing.cashPaid += additionalCashPaid;
      existing.waterUnits += additionalWaterUnits;

      const totalWaterCost = existing.waterUnits * 600;
      const totalPaid = existing.cashPaid;
      const newBalance = totalPaid - totalWaterCost + previousBalance;

      existing.balance = newBalance;

      await existing.save();
      console.log("✅ Updated today's payment:", existing);
    } else {
      // First payment of the day
      const totalWaterCost = additionalWaterUnits * 600;
      const newBalance = additionalCashPaid - totalWaterCost + previousBalance;

      const payment = new Payment({
        date: today,
        cashPaid: additionalCashPaid,
        waterUnits: additionalWaterUnits,
        balance: newBalance,
        services: [],
      });

      await payment.save();
      console.log("✅ Created new payment for today:", payment);
    }
  } catch (err) {
    console.error("Error creating or updating payment:", err);
  } finally {
    await mongoose.disconnect();
  }
}

createTodayPayment();
