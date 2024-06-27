const { subject } = require('@casl/ability');
// eslint-disable-next-line import/no-extraneous-dependencies
const midtransClient = require('midtrans-client');
const Invoices = require('./model');
const Orders = require('../order/model');
const { policyFor } = require('../policy');
const { clientKey, serverKey } = require('../config');

async function handleMidtransNotification(req, res) {
  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey,
      clientKey,
    });

    const statusResponse = await snap.transaction.notification(req.body);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        await snap.transaction.approve(orderId);
        await Invoices.findOneAndUpdate({ order: orderId }, { payment_status: 'paid' });
        await Orders.findOneAndUpdate({ _id: orderId }, { status: 'processing' });
        return res.json('success');
      } if (fraudStatus === 'accept') {
        await Invoices.findOneAndUpdate({ order: orderId }, { payment_status: 'paid' });
        await Orders.findOneAndUpdate({ _id: orderId }, { status: 'processing' });
        return res.json('success');
      }
      return res.json('ok');
    } if (transactionStatus === 'settlement') {
      await Invoices.findOneAndUpdate({ order: orderId }, { payment_status: 'paid' });
      await Orders.findOneAndUpdate({ _id: orderId }, { status: 'delivered' });
      return res.json('success');
    }
  } catch (err) {
    return res.status(500).json('something went wrong');
  }
  return true;
}

async function initiatePayment(req, res, next) {
  try {
    const { orderId } = req.params;

    const invoice = await Invoices
      .findOne({ order: orderId })
      .populate('order')
      .populate('user');
    if (!invoice) {
      return res.json({
        error: 1,
        message: 'Invoice not found',
      });
    }

    const snap = new midtransClient.Snap({
      isProduction: true,
      serverKey,
      clientKey,
    });

    const parameter = {
      transaction_details: {
        order_id: invoice.order._id,
        gross_amount: invoice.total,
      },
      credit_card: {
        secure: true,
      },
      item_details: invoice.order.order_items,
      customer_details: {
        first_name: invoice.user.full_name,
        email: invoice.user.email,
        billing_address: {
          first_name: invoice.user.full_name,
          email: invoice.user.email,
          address: invoice.delivery_address.detail_alamat,
          city: invoice.delivery_address.kabupaten,
        },
        shipping_address: {
          first_name: invoice.user.full_name,
          email: invoice.user.email,
          address: invoice.order.delivery_address.detail_alamat,
          city: invoice.order.delivery_address.kabupaten,
        },
      },
    };

    const response = await snap.createTransaction(parameter);

    return res.json(response);
  } catch (err) {
    next(err);
    return res.json({
      error: 1,
      message: 'Something when wrong',
    });
  }
}

async function index(req, res, next) {
  try {
    const { orderId } = req.params;

    const invoice = await Invoices
      .findOne({ order: orderId })
      .populate('order')
      .populate('user');

    const policy = policyFor(req.user);
    const subjectInvoice = subject('Invoices', { ...invoice, user_id: invoice.user._id });

    if (!policy.can('read', subjectInvoice)) {
      return res.json({
        error: 1,
        message: 'You are not allowed to perform this action',
      });
    }

    return res.json(invoice);
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
    return true;
  }
}

module.exports = {
  handleMidtransNotification,
  initiatePayment,
  index,
};
