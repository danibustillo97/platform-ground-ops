const winston = require("winston");
const { LOG_FILE } = require("../config/config");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: LOG_FILE }),
    new winston.transports.Console(),
  ],
});

module.exports = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};
