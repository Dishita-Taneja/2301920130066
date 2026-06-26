/**
 * 0/1 Knapsack solver using dynamic programming.
 * Maximizes total Impact without exceeding capacity (MechanicHours).
 *
 * @param {Array} tasks - Array of { TaskID, Duration, Impact }
 * @param {number} capacity - Total mechanic-hours available
 * @returns {{ selectedTasks: Array, totalImpact: number, totalDuration: number }}
 */
function solveKnapsack(tasks, capacity) {
  const n = tasks.length;

  // dp[i][w] = max impact using first i tasks with capacity w
  // Use 1D rolling array for memory efficiency
  const dp = new Array(capacity + 1).fill(0);
  const selected = Array.from({ length: n }, () => new Array(capacity + 1).fill(false));

  for (let i = 0; i < n; i++) {
    const { Duration, Impact } = tasks[i];

    // Traverse backwards to avoid using same item twice
    for (let w = capacity; w >= Duration; w--) {
      const withItem = dp[w - Duration] + Impact;
      if (withItem > dp[w]) {
        dp[w] = withItem;
        selected[i][w] = true;
      }
    }
  }

  // Backtrack to find which tasks were selected
  const chosenTasks = [];
  let remainingCapacity = capacity;

  for (let i = n - 1; i >= 0; i--) {
    if (selected[i][remainingCapacity]) {
      chosenTasks.push(tasks[i]);
      remainingCapacity -= tasks[i].Duration;
    }
  }

  const totalImpact = chosenTasks.reduce((sum, t) => sum + t.Impact, 0);
  const totalDuration = chosenTasks.reduce((sum, t) => sum + t.Duration, 0);

  return {
    selectedTasks: chosenTasks,
    totalImpact,
    totalDuration,
  };
}

module.exports = { solveKnapsack };
