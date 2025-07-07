const WaterBill = require("../models/WaterBill");

exports.getDailyBills = async (req, res) => {
  try {
    const bills = await WaterBill.find().sort({ date: -1 }).limit(30);
    res.json(bills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addWaterBill = async (req, res) => {
  const { date, litres, costPerLitre } = req.body;
  if (!date || !litres || !costPerLitre)
    return res
      .status(400)
      .json({ message: "Date, litres, and costPerLitre are required" });

  try {
    const existingBill = await WaterBill.findOne({ date });
    if (existingBill)
      return res
        .status(400)
        .json({ message: "Water bill for this date already exists" });

    const bill = new WaterBill({ date, litres, costPerLitre });
    await bill.save();
    res.status(201).json(bill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
