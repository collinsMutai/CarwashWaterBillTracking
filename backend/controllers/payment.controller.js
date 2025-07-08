const Payment = require("../models/Payment");
const Vehicle = require("../models/Vehicle");

const WATER_COST_PER_UNIT = 600;

exports.addPayment = async (req, res) => {
  const { date, cashPaid = 0, services = [], waterUnits = 1 } = req.body;

  if (!date) return res.status(400).json({ message: "Date is required" });
  if (waterUnits < 1)
    return res.status(400).json({ message: "Water units must be at least 1" });

  try {
    // Validate vehicles in services array
    for (const svc of services) {
      const vehicleExists = await Vehicle.findById(svc.vehicle);
      if (!vehicleExists)
        return res
          .status(400)
          .json({ message: `Vehicle ${svc.vehicle} not found` });
    }

    // Normalize date to start of day
    const paymentDate = new Date(date);
    paymentDate.setHours(0, 0, 0, 0);

    // Get previous day's payment to retrieve previous balance
    const prevDate = new Date(paymentDate);
    prevDate.setDate(prevDate.getDate() - 1);

    const prevPayment = await Payment.findOne({ date: prevDate });
    const previousBalance = prevPayment ? prevPayment.balance || 0 : 0;

    // Calculate today's water cost (base cost * waterUnits)
    const totalWaterCost = WATER_COST_PER_UNIT * waterUnits;

    // Calculate total owed: today's water cost + previous balance owed
    const totalOwed = totalWaterCost + previousBalance;

    // Sum service fees for today
    const totalServiceFees = services.reduce(
      (sum, s) => sum + (s.serviceFee || 0),
      0
    );

    // Total paid = cash paid + service fees paid today
    const totalPaid = cashPaid + totalServiceFees;

    // New balance (positive means credit, negative means owed)
    const newBalance = totalPaid - totalOwed;

    // Check if a payment record already exists for this date
    let payment = await Payment.findOne({ date: paymentDate });

    if (payment) {
      // Update existing payment record
      payment.cashPaid += cashPaid;
      payment.services = payment.services.concat(
        services.map((s) => ({
          vehicle: s.vehicle,
          serviceFee: s.serviceFee,
        }))
      );
      payment.balance = newBalance;
      payment.waterUnits = waterUnits; // update waterUnits if needed
    } else {
      // Create new payment record
      payment = new Payment({
        date: paymentDate,
        cashPaid,
        services: services.map((s) => ({
          vehicle: s.vehicle,
          serviceFee: s.serviceFee,
        })),
        balance: newBalance,
        waterUnits,
      });
    }

    await payment.save();

    res.status(201).json({
      payment,
      message:
        newBalance >= 0
          ? `Payment recorded. Credit balance: KES ${newBalance}`
          : `Payment recorded. Outstanding balance: KES ${-newBalance}`,
    });
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
