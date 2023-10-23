const router = require('express').Router();

const invoiceController = require('./controller');

router.get('/invoices/:orderId', invoiceController.index);

module.exports = router;
