const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
const Invoices = require('../invoice/model');
// eslint-disable-next-line import/order
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ordersSchema = new Schema({
  status: {
    type: String,
    enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered'],
    default: 'waiting_payment',
  },
  delivery_fee: {
    type: Number,
    default: 0,
  },
  delivery_address: {
    provinsi: { type: String, required: [true, 'Province must be filled'] },
    kabupaten: { type: String, required: [true, 'Regency must be filled'] },
    kecamatan: { type: String, required: [true, 'District must be filled'] },
    kelurahan: { type: String, required: [true, 'Village must be filled'] },
    detail_alamat: { type: String },
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
  order_items: [
    {
      type: Schema.Types.ObjectId,
      ref: 'OrderItems',
    },
  ],
}, { timestamps: true });

ordersSchema.virtual('items_count').get(function () {
  return this.order_items.reduce((total, item) => total + parseInt(item.qty, 10), 0);
});

ordersSchema.plugin(AutoIncrement, { inc_field: 'order_number' });

ordersSchema.post('save', async function () {
  const subTotal = this.order_items.reduce((sum, item) => {
    sum += (item.qty * item.price);
    return sum;
  }, 0);

  const invoice = new Invoices({
    user: this.user,
    order: this._id,
    sub_total: subTotal,
    delivery_fee: parseInt(this.delivery_fee, 10),
    delivery_address: this.delivery_address,
    total: parseInt(subTotal + this.delivery_fee, 10),
  });

  await invoice.save();
});

module.exports = model('Orders', ordersSchema);
