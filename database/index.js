const mongoose = require('mongoose');
const { mongoDbUri, dbName } = require('../apps/config');

const db = mongoose.connection;

(async () => {
  try {
    const uri = `${mongoDbUri}/${dbName}`;
    await mongoose.connect(uri);
  } catch (error) {
    console.error(error);
  }
})();

module.exports = db;
