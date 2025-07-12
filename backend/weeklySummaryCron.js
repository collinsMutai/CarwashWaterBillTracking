const cron = require("node-cron");
const {
  getWeeklyServiceSummaryData,
} = require("./controllers/payment.controller");

function startWeeklySummaryCron() {
  // Run every Monday at 00:05 AM
  cron.schedule("5 0 * * 1", async () => {
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

      console.log("✅ Weekly summary cron job complete.");
    } catch (err) {
      console.error("❌ Error in weekly summary cron job:", err.message);
    }
  });
}

module.exports = startWeeklySummaryCron;
