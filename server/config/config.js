require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  LOG_FILE: process.env.LOG_FILE || "server/logs/error.log",
};
