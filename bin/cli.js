#!/usr/bin/env node

const path = require("path");

// Set up environment
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

// Default paths
if (!process.env.RECALL_STACK_PATH) {
  const home = process.env.HOME || process.env.USERPROFILE || "/root";
  process.env.RECALL_STACK_PATH = path.join(home, ".claude");
}

console.log("recall-stack-dashboard");
console.log(`Reading from: ${process.env.RECALL_STACK_PATH}`);
console.log("");

// Launch the server
require("tsx/cjs");
require(path.join(__dirname, "..", "server.ts"));
