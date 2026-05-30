/**
 * Stops stale Next dev servers, clears build caches, starts a clean dev server.
 */
const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const cacheDirs = [
  path.join(root, ".next"),
  path.join(root, "node_modules", ".cache"),
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
    fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    console.log(`Removed ${path.relative(root, dir)}`);
  } catch (err) {
    console.warn(`Could not remove ${dir}:`, err.message);
  }
}

async function main() {
  for (const port of [3000, 3001, 3002, 3003, 3004]) {
    killPort(port);
  }

  // Let Windows release file locks on .next
  await sleep(800);

  for (const dir of cacheDirs) {
    rmDir(dir);
  }

  const useWebpack = process.argv.includes("--webpack");
  const args = useWebpack
    ? ["next", "dev", "-p", "3000"]
    : ["next", "dev", "--turbopack", "-p", "3000"];

  console.log(
    `Starting dev server on http://localhost:3000 (${useWebpack ? "webpack" : "turbopack"}) ...`
  );

  const child = spawn("npx", args, {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, NODE_ENV: "development" },
  });

  child.on("exit", (code) => process.exit(code ?? 0));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
