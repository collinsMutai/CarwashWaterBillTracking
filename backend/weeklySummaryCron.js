const cron = require("node-cron");
const mongoose = require("mongoose");
const {
  getWeeklyServiceSummaryData,
} = require("./controllers/payment.controller");
const weeklySummarySchema = require("./models/WeeklySummary.model");

// Connect to second MongoDB (jupscarwash)
const secondDb = mongoose.createConnection(process.env.SECOND_MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const WeeklySummary = secondDb.model("WeeklySummary", weeklySummarySchema);

function startWeeklySummaryCron() {
  cron.schedule(
    "35 22 * * 1", // Every Monday at 10:00 PM
    async () => {
      console.log("📆 Running weekly summary cron job...");

      try {
        const summary = await getWeeklyServiceSummaryData();

        console.log(
          `📊 Weekly Summary: ${summary.weekStart.toDateString()} - ${summary.weekEnd.toDateString()}`
        );

        summary.services.forEach((s) => {
          console.log(
            `🚗 ${s.registration} | ${s.description} | Washes: ${s.numberOfWashes} | Total Fee: KES ${s.totalServiceFee}`
          );
        });

        // Check if a summary for this week already exists in DB
        const existing = await WeeklySummary.findOne({
          weekStart: summary.weekStart,
          weekEnd: summary.weekEnd,
        });

        if (existing) {
          console.log(
            `⚠️ Weekly summary for ${summary.weekStart.toDateString()} - ${summary.weekEnd.toDateString()} already saved. Skipping save.`
          );
          return;
        }

        // Save summary to second DB
        const saved = await WeeklySummary.create(summary);
        console.log(`✅ Weekly summary saved to DB with id: ${saved._id}`);
      } catch (err) {
        console.error(
          "❌ Error in weekly summary cron job:",
          err.stack || err.message
        );
      }
    },
    {
      timezone: "Africa/Nairobi", // Adjust as needed
    }
  );
}

module.exports = startWeeklySummaryCron;
