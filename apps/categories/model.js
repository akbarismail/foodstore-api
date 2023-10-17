const { Schema, model } = require('mongoose');

const categoriesSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [3, 'Panjang nama kategori minimal 3 karakter'],
      maxlength: [20, 'Panjang nama kategori maksimal 20 karakter'],
      required: [true, 'Nama kategori harus diisi'],
    },
  },
  { timestamps: true },
);

module.exports = model('Categories', categoriesSchema);
