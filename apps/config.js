require('dotenv').config();
const path = require('path');

module.exports = {
  rootPath: path.resolve(__dirname, '..'),
  serviceName: process.env.SERVICE_NAME,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
};
