const mongoose = require('mongoose');
const {
  dbHost, dbPort, dbName,
} = require('../apps/config');

(async () => {
  try {
    // const uri = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
    const uri = `mongodb://${dbHost}:${dbPort}/${dbName}`;
    await mongoose.connect(uri);
  } catch (error) {
    console.error(error.message);
  }
})();

module.exports = mongoose.connection;
