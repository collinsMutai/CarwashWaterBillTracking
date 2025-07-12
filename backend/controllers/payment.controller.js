const Payment = require("../models/Payment");
const Vehicle = require("../models/Vehicle");
const moment = require("moment");

const WATER_COST_PER_UNIT = 600;

// Helper: recalculate balances starting from a given date
async function recalcBalancesFrom(date) {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const prevDate = new Date(startDate.getTime());
  prevDate.setDate(prevDate.getDate() - 1);
  const prevStart = new Date(prevDate);
  prevStart.setHours(0, 0, 0, 0);
  const prevEnd = new Date(prevDate);
  prevEnd.setHours(23, 59, 59, 999);

  let prevPayment = await Payment.findOne({
    date: { $gte: prevStart, $lte: prevEnd },
  });

  let prevBalance = prevPayment?.balance ?? 0;

  const payments = await Payment.find({ date: { $gte: startDate } }).sort({
    date: 1,
  });

  for (const payment of payments) {
    const totalServiceFees = payment.services.reduce(
      (sum, s) => sum + (s.serviceFee || 0),
      0
    );

    const totalPaid = payment.cashPaid + totalServiceFees;
    payment.balance =
      prevBalance + totalPaid - WATER_COST_PER_UNIT * payment.waterUnits;

    await payment.save();
    prevBalance = payment.balance;
  }
}

exports.addPayment = async (req, res) => {
  const { date, cashPaid = 0, services = [], waterUnits = 0 } = req.body;

  if (!date) return res.status(400).json({ message: "Date is required" });
  if (waterUnits < 0)
    return res
      .status(400)
      .json({ message: "Water units must be zero or more" });

  try {
    const paymentDate = new Date(`${date}T00:00:00+03:00`);

    for (const svc of services) {
      const vehicleExists = await Vehicle.findById(svc.vehicle);
      if (!vehicleExists) {
        return res
          .status(400)
          .json({ message: `Vehicle ${svc.vehicle} not found` });
      }
    }

    const todayStart = new Date(paymentDate);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(paymentDate);
    todayEnd.setHours(23, 59, 59, 999);

    let payment = await Payment.findOne({
      date: { $gte: todayStart, $lte: todayEnd },
    });

    const prevDate = new Date(todayStart);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevStart = new Date(prevDate);
    prevStart.setHours(0, 0, 0, 0);
    const prevEnd = new Date(prevDate);
    prevEnd.setHours(23, 59, 59, 999);

    const prevPayment = await Payment.findOne({
      date: { $gte: prevStart, $lte: prevEnd },
    });

    const previousBalance = prevPayment?.balance ?? 0;

    if (payment) {
      payment.cashPaid += cashPaid;
      payment.services.push(
        ...services.map((s) => ({
          vehicle: s.vehicle,
          serviceFee: s.serviceFee,
        }))
      );
      payment.waterUnits += waterUnits;

      const totalServiceFees = payment.services.reduce(
        (sum, s) => sum + (s.serviceFee || 0),
        0
      );

      const totalPaid = payment.cashPaid + totalServiceFees;
      payment.balance =
        previousBalance + totalPaid - WATER_COST_PER_UNIT * payment.waterUnits;
    } else {
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

    await recalcBalancesFrom(
      new Date(payment.date.getTime() + 24 * 3600 * 1000)
    );

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

exports.updatePayment = async (req, res) => {
  const paymentId = req.params.id;
  const { cashPaid, services, waterUnits } = req.body;

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    if (services) {
      for (const svc of services) {
        const vehicleExists = await Vehicle.findById(svc.vehicle);
        if (!vehicleExists) {
          return res
            .status(400)
            .json({ message: `Vehicle ${svc.vehicle} not found` });
        }
      }
    }

    if (cashPaid !== undefined) payment.cashPaid = cashPaid;
    if (services !== undefined)
      payment.services = services.map((s) => ({
        vehicle: s.vehicle,
        serviceFee: s.serviceFee,
      }));
    if (waterUnits !== undefined) {
      if (waterUnits < 0)
        return res
          .status(400)
          .json({ message: "Water units must be zero or more" });
      payment.waterUnits = waterUnits;
    }

    await payment.save();
    await recalcBalancesFrom(payment.date);

    const updatedPayment = await Payment.findById(paymentId);

    res.json({
      payment: updatedPayment,
      message:
        updatedPayment.balance >= 0
          ? `Payment updated. Credit balance: KES ${updatedPayment.balance}`
          : `Payment updated. Outstanding balance: KES ${-updatedPayment.balance}`,
    });
  } catch (err) {
    console.error("Error updating payment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deletePayment = async (req, res) => {
  const paymentId = req.params.id;

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const paymentDate = payment.date;
    await payment.deleteOne();
    await recalcBalancesFrom(paymentDate);

    res.json({ message: "Payment deleted and balances updated" });
  } catch (err) {
    console.error("Error deleting payment:", err);
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

// === NEW HELPER function for summary ===
async function getWeeklyServiceSummaryData(startDate) {
  const startOfWeek = startDate
    ? moment(startDate).startOf("isoWeek").toDate()
    : moment().startOf("isoWeek").toDate();

  const endOfWeek = moment(startOfWeek).endOf("isoWeek").toDate();

  const payments = await Payment.find({
    date: { $gte: startOfWeek, $lte: endOfWeek },
  }).populate("services.vehicle");

  const vehicleMap = new Map();

  for (const payment of payments) {
    for (const service of payment.services) {
      const vehicle = service.vehicle;
      if (!vehicle) continue;

      const key = vehicle._id.toString();

      if (!vehicleMap.has(key)) {
        vehicleMap.set(key, {
          vehicleId: vehicle._id,
          registration: vehicle.registration,
          description: vehicle.description,
          clientName: vehicle.clientName || "",
          serviceFeePerWash: service.serviceFee,
          numberOfWashes: 1,
          totalServiceFee: service.serviceFee,
        });
      } else {
        const vData = vehicleMap.get(key);
        vData.numberOfWashes += 1;
        vData.totalServiceFee += service.serviceFee;
      }
    }
  }

  return {
    weekStart: startOfWeek,
    weekEnd: endOfWeek,
    services: Array.from(vehicleMap.values()),
  };
}

exports.getWeeklyServiceSummaryData = getWeeklyServiceSummaryData;

// Express controller uses the helper
exports.getWeeklyServices = async (req, res) => {
  try {
    const summary = await getWeeklyServiceSummaryData(req.query.startDate);
    res.json(summary);
  } catch (err) {
    console.error("Error fetching weekly services:", err);
    res.status(500).json({ message: "Server error" });
  }
};
