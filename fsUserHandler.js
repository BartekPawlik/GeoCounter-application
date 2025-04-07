// fsUserHandler.js

const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, 'userData', "userData.json");

function readUsers() {
  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading users:", err);
    return [];
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing users:", err);
  }
}

module.exports = {
  readUsers,
  writeUsers,
};
