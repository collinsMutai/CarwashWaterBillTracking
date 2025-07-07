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
  date: { type: Date, required: true },
  cashPaid: { type: Number, default: 0 },
  services: [serviceSchema],
});

module.exports = mongoose.model("Payment", paymentSchema);
