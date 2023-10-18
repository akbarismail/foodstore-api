const router = require('express').Router();

const regionController = require('./controller');

router.get('/region/province', regionController.getProvince);
router.get('/region/regency', regionController.getRegency);
router.get('/region/district', regionController.getDistrict);
router.get('/region/village', regionController.getVillage);

module.exports = router;
