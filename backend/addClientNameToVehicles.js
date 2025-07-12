require("dotenv").config();
const mongoose = require("mongoose");
const Vehicle = require("./models/Vehicle");

async function updateVehicles() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Update all vehicles by setting clientName to 'SALLY ANN SCHOOL' if not already set
    const result = await Vehicle.updateMany(
      { clientName: { $exists: false } }, // or clientName: null if you want
      { $set: { clientName: "SALLY ANN SCHOOL" } }
    );

    console.log(`Matched ${result.matchedCount} vehicles.`);
    console.log(`Modified ${result.modifiedCount} vehicles.`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error updating vehicles:", err);
  }
}

updateVehicles();
