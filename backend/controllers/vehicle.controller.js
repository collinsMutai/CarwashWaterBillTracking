const Vehicle = require("../models/Vehicle");

exports.searchVehicles = async (req, res) => {
  const search = req.query.search || "";
  try {
    const vehicles = await Vehicle.find({
      registration: { $regex: search, $options: "i" },
    }).limit(10);
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addVehicle = async (req, res) => {
  const { registration, description } = req.body;
  if (!registration)
    return res.status(400).json({ message: "Registration required" });

  try {
    const existing = await Vehicle.findOne({ registration });
    if (existing)
      return res.status(400).json({ message: "Vehicle already exists" });

    const vehicle = new Vehicle({ registration, description });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
