const { Schema, model } = require('mongoose');

const tagsSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [3, 'Panjang nama tags minimal 3 karakter'],
      maxlength: [20, 'Panjang nama tags maksimal 20 karakter'],
      required: [true, 'Nama tags harus diisi'],
    },
  },
  { timestamps: true }
);

module.exports = model('Tags', tagsSchema);
