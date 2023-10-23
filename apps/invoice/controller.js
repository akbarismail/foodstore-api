const { subject } = require('@casl/ability');
const Invoices = require('./model');
const { policyFor } = require('../policy');

async function index(req, res) {
  try {
    const { orderId } = req.params;

    const invoice = await Invoices.findOne({ order: orderId })
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
    return res.json({
      error: 1,
      message: err.message,
    });
  }
}

module.exports = {
  index,
};
