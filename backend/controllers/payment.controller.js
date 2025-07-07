const Payment = require("../models/Payment");
const Vehicle = require("../models/Vehicle");

exports.addPayment = async (req, res) => {
  const { date, cashPaid, services } = req.body;

  if (!date) return res.status(400).json({ message: "Date is required" });

  try {
    // Validate vehicles
    for (const svc of services) {
      const vehicleExists = await Vehicle.findById(svc.vehicle);
      if (!vehicleExists)
        return res
          .status(400)
          .json({ message: `Vehicle ${svc.vehicle} not found` });
    }

    const payment = new Payment({
      date: new Date(date),
      cashPaid,
      services: services.map((s) => ({
        vehicle: s.vehicle,
        serviceFee: s.serviceFee,
      })),
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("services.vehicle")
      .sort({ date: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
