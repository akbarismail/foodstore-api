const path = require('path');
const csv = require('csvtojson');

async function getProvince(req, res) {
  const dbProvince = path.resolve(__dirname, './data/provinces.csv');
  try {
    const data = await csv().fromFile(dbProvince);
    return res.json(data);
  } catch (err) {
    return res.json({
      error: 1,
      message: 'Can not take province data, call administrator',
    });
  }
}

async function getRegency(req, res) {
  const dbRegency = path.resolve(__dirname, './data/regencies.csv');
  try {
    const { kodeInduk } = req.query;
    const data = await csv().fromFile(dbRegency);
    if (!kodeInduk) return res.json(data);
    return res.json(data.filter((value) => value.kode_provinsi === kodeInduk));
  } catch (err) {
    return res.json({
      error: 1,
      message: 'Can not take regency data, call administrator',
    });
  }
}

async function getDistrict(req, res) {
  const dbDistrict = path.resolve(__dirname, './data/districts.csv');
  try {
    const { kodeInduk } = req.query;
    const data = await csv().fromFile(dbDistrict);
    if (!kodeInduk) return res.json(data);
    return res.json(data.filter((value) => value.kode_kabupaten === kodeInduk));
  } catch (err) {
    return res.json({
      error: 1,
      message: 'Can not take district data, call administrator',
    });
  }
}

async function getVillage(req, res) {
  const dbVillage = path.resolve(__dirname, './data/villages.csv');
  try {
    const { kodeInduk } = req.query;
    const data = await csv().fromFile(dbVillage);
    if (!kodeInduk) return res.json(data);
    return res.json(data.filter((value) => value.kode_kecamatan === kodeInduk));
  } catch (err) {
    return res.json({
      error: 1,
      message: 'Can not take village data, call administrator',
    });
  }
}

module.exports = {
  getProvince,
  getRegency,
  getDistrict,
  getVillage,
};
