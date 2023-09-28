const mongoose = require('mongoose');
const { dbHost, dbName, dbPass, dbPort, dbUser } = require('../apps/config');

const db = mongoose.connection;

(async () => {
  try {
    const uri = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;
    await mongoose.connect(uri);
  } catch (error) {
    console.error(error);
  }
})();

module.exports = db;
