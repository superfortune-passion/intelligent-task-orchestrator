/**
 * Stops stale Next dev servers, clears build caches, starts a clean dev server.
 */
const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const nextDir = path.join(root, ".next");
const webpackCache = path.join(root, "node_modules", ".cache");

function killPort(port) {
  try {
    if (process.platform === "win32") {
      const out = execSync(`netstat -ano | findstr :${port}`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
      });
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
    } else {
      execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null`, {
        stdio: "ignore",
        shell: true,
      });
    }
  } catch {
    /* port free */
  }
}

function rmDir(dir) {
  if (!fs.existsSync(dir)) return;
  try {
    fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 });
    console.log(`Removed ${path.relative(root, dir)}`);
  } catch (err) {
    console.warn(`Could not remove ${dir}:`, err.message);
  }
}

// Stop dev server BEFORE deleting cache (Windows file locks)
for (const port of [3000, 3001, 3002, 3003, 3004]) {
  killPort(port);
}

rmDir(nextDir);
rmDir(webpackCache);

console.log("Starting dev server on http://localhost:3000 ...");

const child = spawn("npx", ["next", "dev", "-p", "3000"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
