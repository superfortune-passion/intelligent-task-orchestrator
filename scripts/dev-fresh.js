/**
 * Kills stale Next dev processes on port 3000, clears .next, starts dev server.
 */
const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const nextDir = path.join(root, ".next");

function killPort(port) {
  try {
    if (process.platform === "win32") {
      const out = execSync(
        `netstat -ano | findstr :${port}`,
        { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }
      );
      const pids = new Set();
      for (const line of out.split("\n")) {
        const m = line.trim().match(/\s+(\d+)\s*$/);
        if (m) pids.add(m[1]);
      }
      for (const pid of pids) {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
        } catch {
          /* already gone */
        }
      }
    }
  } catch {
    /* port free */
  }
}

if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log("Removed .next cache");
}

killPort(3000);
console.log("Starting dev server on http://localhost:3000 ...");

const child = spawn("npx", ["next", "dev", "-p", "3000"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
