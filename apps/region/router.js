const router = require('express').Router();

const regionController = require('./controller');

router.get('/region/provinsi', regionController.getProvince);
router.get('/region/kabupaten', regionController.getRegency);
router.get('/region/kecamatan', regionController.getDistrict);
router.get('/region/kelurahan', regionController.getVillage);

module.exports = router;
