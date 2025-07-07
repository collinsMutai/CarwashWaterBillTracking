require("dotenv").config(); // load .env variables
const mongoose = require("mongoose");
const User = require("./models/User"); // adjust path if needed

async function createUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const user = new User({
      username: "testuser",
      password: "testpassword",
    });
    await user.save();
    console.log("User created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating user:", err);
    process.exit(1);
  }
}

createUser();
