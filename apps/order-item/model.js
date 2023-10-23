const { Schema, model } = require('mongoose');

const orderItemsSchema = new Schema({
  name: {
    type: String,
    minlength: [5, 'Panjang nama makanan minimal 5 karakter'],
    required: [true, 'name must be filled'],
  },
  price: {
    type: Number,
    required: [true, 'Item price must be filled'],
  },
  qty: {
    type: Number,
    required: [true, 'Qty must be filled'],
    min: [1, 'Qty minimum 1'],
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Products',
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Orders',
  },
});

module.exports = model('OrderItems', orderItemsSchema);
