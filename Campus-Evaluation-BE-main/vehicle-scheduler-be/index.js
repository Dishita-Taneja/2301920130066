require("dotenv").config();

const express = require("express");
const { fetchDepots, fetchVehicles } = require("./src/apiService");
const { solveKnapsack } = require("./src/knapsack");

const app = express();
app.use(express.json());

/**
 * GET /schedule
 * Fetches depots & vehicles, then runs knapsack for each depot.
 * Returns optimal task assignments per depot.
 */
app.get("/schedule", async (req, res) => {
  try {
    console.log("[/schedule] Fetching depots and vehicles...");
    const [depots, vehicles] = await Promise.all([fetchDepots(), fetchVehicles()]);

    console.log(`[/schedule] Depots: ${depots.length}, Vehicles/Tasks: ${vehicles.length}`);

    const results = depots.map((depot) => {
      const { selectedTasks, totalImpact, totalDuration } = solveKnapsack(
        vehicles,
        depot.MechanicHours
      );

      return {
        depotID: depot.ID,
        mechanicHoursBudget: depot.MechanicHours,
        mechanicHoursUsed: totalDuration,
        totalImpactScore: totalImpact,
        selectedTaskCount: selectedTasks.length,
        selectedTasks: selectedTasks.map((t) => ({
          TaskID: t.TaskID,
          Duration: t.Duration,
          Impact: t.Impact,
        })),
      };
    });

    console.log("[/schedule] Scheduling complete.");
    return res.status(200).json({
      success: true,
      totalDepots: depots.length,
      totalAvailableTasks: vehicles.length,
      schedule: results,
    });
  } catch (error) {
    console.error("[/schedule] Error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /health
 * Simple health check endpoint.
 */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "vehicle-maintenance-scheduler" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vehicle Maintenance Scheduler running on port ${PORT}`);
  console.log(`  GET /health   - Health check`);
  console.log(`  GET /schedule - Run scheduling optimization`);
});

module.exports = app;
