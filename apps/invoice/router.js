const router = require('express').Router();

const invoiceController = require('./controller');

router.get('/invoices/:orderId', invoiceController.index);
router.get('/invoices/:orderId/initiate-payment', invoiceController.initiatePayment);
router.post('/invoices/handle-midtrans', invoiceController.handleMidtransNotification);

module.exports = router;
