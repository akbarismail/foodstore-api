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
    provinsi: { type: String, required: [true, 'Provinsi must be filled'] },
    kabupaten: { type: String, required: [true, 'Kabupaten must be filled'] },
    kecamatan: { type: String, required: [true, 'Kecamatan must be filled'] },
    kelurahan: { type: String, required: [true, 'Kelurahan must be filled'] },
    detail_alamat: { type: String },
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
}, { timestamps: true });

module.exports = model('Invoices', invoiceSchema);
