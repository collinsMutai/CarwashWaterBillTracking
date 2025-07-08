const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  serviceFee: {
    type: Number,
    required: true,
    min: 0,
  },
});

const paymentSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  cashPaid: { type: Number, default: 0 },
  services: [serviceSchema],
  waterUnits: { type: Number, default: 1 },
  balance: { type: Number, default: 0 },
});

module.exports = mongoose.model("Payment", paymentSchema);
