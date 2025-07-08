const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  serviceFee: { type: Number, required: true },
});

const paymentSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  cashPaid: { type: Number, default: 0 },
  services: [serviceSchema],
  balance: { type: Number, default: 0 }, // positive = credit, negative = owed
  waterUnits: { type: Number, default: 1 }, // multiplier for water usage
});

module.exports = mongoose.model("Payment", paymentSchema);
