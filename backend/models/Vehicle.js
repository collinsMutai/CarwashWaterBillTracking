const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  registration: { type: String, unique: true, required: true },
  description: String,
  clientName: { type: String, default: null }, // New field added
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
