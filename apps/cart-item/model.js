const { Schema, model } = require('mongoose');

const cartItem = new Schema({
  name: {
    type: String,
    minlength: [5, 'Panjang nama makanan minimal 50 karakter'],
    required: [true, 'name must be filled'],
  },
  qty: {
    type: Number,
    required: [true, 'qty must be filled'],
    minlength: [1, 'minimal qty adalah 1'],
  },
  price: {
    type: Number,
    default: 0,
  },
  image_url: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Products',
  },
});

module.exports = model('CartItems', cartItem);
