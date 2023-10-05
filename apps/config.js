require('dotenv').config();
const path = require('path');

module.exports = {
  rootPath: path.resolve(__dirname, '..'),
  serviceName: process.env.SERVICE_NAME,
  mongoDbUri: process.env.MONGODB_URI,
  dbName: process.env.DB_NAME,
};
