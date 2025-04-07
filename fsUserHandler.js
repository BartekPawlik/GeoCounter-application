// fsUserHandler.js
import fs from "fs";
import path from "path";

// Update the path to point to the data directory
const filePath = path.join(__dirname, "..", "data","users", "userData.json");

function readUsers() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data || "[]");
}

function writeUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf8");
}

export { readUsers, writeUsers };
