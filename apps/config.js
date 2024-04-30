require('dotenv').config();
const path = require('path');

module.exports = {
  rootPath: path.resolve(__dirname, '..'),
  secretKey: process.env.SECRET_KEY,
  serviceName: process.env.SERVICE_NAME,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  dbHost: process.env.DB_HOST,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
};
