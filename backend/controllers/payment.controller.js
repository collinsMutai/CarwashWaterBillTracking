const Payment = require("../models/Payment");
const Vehicle = require("../models/Vehicle");

const WATER_COST_PER_UNIT = 600;

exports.addPayment = async (req, res) => {
  const { date, cashPaid = 0, services = [], waterUnits = 0 } = req.body;

  if (!date) return res.status(400).json({ message: "Date is required" });
  if (waterUnits < 0)
    return res
      .status(400)
      .json({ message: "Water units must be zero or more" });

  try {
    // Normalize date to EAT timezone start of day (fresh Date objects)
    const paymentDate = new Date(`${date}T00:00:00+03:00`);

    // Validate vehicles
    for (const svc of services) {
      const vehicleExists = await Vehicle.findById(svc.vehicle);
      if (!vehicleExists) {
        return res
          .status(400)
          .json({ message: `Vehicle ${svc.vehicle} not found` });
      }
    }

    // Calculate previous day's date range in EAT
    const prevDate = new Date(paymentDate.getTime());
    prevDate.setDate(prevDate.getDate() - 1);

    const prevStart = new Date(prevDate.getTime());
    prevStart.setHours(0, 0, 0, 0);

    const prevEnd = new Date(prevDate.getTime());
    prevEnd.setHours(23, 59, 59, 999);

    const prevPayment = await Payment.findOne({
      date: { $gte: prevStart, $lte: prevEnd },
    });

    const previousBalance = prevPayment?.balance ?? 0;

    // Today range for querying payments
    const todayStart = new Date(paymentDate.getTime());
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(paymentDate.getTime());
    todayEnd.setHours(23, 59, 59, 999);

    // Find today's existing payment record
    let payment = await Payment.findOne({
      date: { $gte: todayStart, $lte: todayEnd },
    });

    if (payment) {
      // Update cashPaid and services by adding new data
      payment.cashPaid += cashPaid;
      payment.services.push(
        ...services.map((s) => ({
          vehicle: s.vehicle,
          serviceFee: s.serviceFee,
        }))
      );

      // Accumulate waterUnits by adding new units to existing
      payment.waterUnits += waterUnits;

      // Recalculate total service fees for all services today
      const totalServiceFees = payment.services.reduce(
        (sum, s) => sum + (s.serviceFee || 0),
        0
      );

      // Calculate total paid (cash + service fees)
      const totalPaid = payment.cashPaid + totalServiceFees;

      // Update balance based on previous balance, total paid, minus water cost
      payment.balance =
        previousBalance + totalPaid - WATER_COST_PER_UNIT * payment.waterUnits;
    } else {
      // New payment record
      const totalServiceFees = services.reduce(
        (sum, s) => sum + (s.serviceFee || 0),
        0
      );

      const totalPaid = cashPaid + totalServiceFees;
      const newBalance =
        previousBalance + totalPaid - WATER_COST_PER_UNIT * waterUnits;

      payment = new Payment({
        date: todayStart,
        cashPaid,
        services: services.map((s) => ({
          vehicle: s.vehicle,
          serviceFee: s.serviceFee,
        })),
        waterUnits,
        balance: newBalance,
      });
    }

    await payment.save();

    res.status(201).json({
      payment,
      message:
        payment.balance >= 0
          ? `Payment recorded. Credit balance: KES ${payment.balance}`
          : `Payment recorded. Outstanding balance: KES ${-payment.balance}`,
    });
  } catch (err) {
    console.error("Error adding payment:", err);
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
    console.error("Error fetching payments:", err);
    res.status(500).json({ message: "Server error" });
  }
};
