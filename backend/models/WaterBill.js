const mongoose = require("mongoose");

const waterBillSchema = new mongoose.Schema({
  date: { type: Date, unique: true, required: true },
  litres: { type: Number, required: true },
  costPerLitre: { type: Number, default: 0.2 }, // example cost per litre (KES)
});

waterBillSchema.virtual("totalAmount").get(function () {
  return this.litres * this.costPerLitre;
});

module.exports = mongoose.model("WaterBill", waterBillSchema);
