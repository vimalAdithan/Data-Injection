import cron from "node-cron";
import { exec } from "child_process";

cron.schedule("0 0 * * *", () => {
  // cron.schedule("* * * * *", () => {
  console.log(`Data refresh triggered at ${new Date().toISOString()}`);
  exec("node scripts/loadCsv.js", (err, stdout, stderr) => {
    if (err) {
      console.log(`Refresh failed: ${err.message}`);
      return;
    }
    console.log("Refresh output: \n" + stdout);
    console.log("Refresh error: \n" + stderr);
  });
});
