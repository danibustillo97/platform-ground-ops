const { LOG_FILE } = require('../config/config');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: LOG_FILE }),
    new winston.transports.Console()
  ]
});

module.exports = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
};
