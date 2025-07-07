const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  registration: { type: String, unique: true, required: true },
  description: String,
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
