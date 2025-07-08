require("dotenv").config();
const mongoose = require("mongoose");
const Vehicle = require("./models/Vehicle"); // Adjust path as needed

// Sample vehicles
const vehicles = [
  { registration: "KBY 713Q", description: "NISSAN TEANA" },
  { registration: "KAJ 377K", description: "TOYOTA PICKUP" },
  { registration: "KBG 956R", description: "SCHOOL BUS" },
  { registration: "KBV 217X", description: "SCHOOL BUS" },
  { registration: "KCS 121S", description: "SCHOOL BUS" },
];

async function createVehicles() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing vehicles (optional)
    // await Vehicle.deleteMany({});

    const created = await Vehicle.insertMany(vehicles);
    console.log("✅ Vehicles created:");
    created.forEach((v) =>
      console.log(`• ${v.registration} – ID: ${v._id.toString()}`)
    );
  } catch (error) {
    console.error("❌ Error creating vehicles:", error);
  } finally {
    mongoose.connection.close();
  }
}

createVehicles();
