const { Schema, model } = require('mongoose');

const invoiceSchema = new Schema({
  sub_total: {
    type: Number,
    required: [true, 'sub total must be filled'],
  },
  delivery_fee: {
    type: Number,
    required: [true, 'deliver fee must be filled'],
  },
  delivery_address: {
    province: { type: String, required: [true, 'Province must be filled'] },
    regency: { type: String, required: [true, 'Regency must be filled'] },
    district: { type: String, required: [true, 'District must be filled'] },
    village: { type: String, required: [true, 'Village must be filled'] },
    detail: { type: String },
  },
  total: {
    type: Number,
    required: [true, 'total must be filled'],
  },
  payment_status: {
    type: String,
    enum: ['waiting_payment', 'paid'],
    default: 'waiting_payment',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Orders',
  },
}, {timestamps: true});

module.exports = model('Invoices', invoiceSchema);
