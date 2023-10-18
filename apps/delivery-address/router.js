const router = require('express').Router();
const multer = require('multer');

const deliveryAddressController = require('./controller');

router.post('/delivery-addresses', multer().none(), deliveryAddressController.store);
router.put('/delivery-addresses/:id', multer().none(), deliveryAddressController.update);
router.delete('/delivery-addresses/:id', deliveryAddressController.destroy);
router.get('/delivery-addresses', deliveryAddressController.index);

module.exports = router;
