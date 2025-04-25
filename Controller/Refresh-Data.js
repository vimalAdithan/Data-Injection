import { exec } from "child_process";

export const refreshData = (req, res) => {
  exec("node scripts/loadCsv.js", (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ message: "Refresh complete", output: stdout });
  });
};
