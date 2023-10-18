const { Schema, model } = require('mongoose');

const deliveryAddress = new Schema({
  name: {
    type: String,
    required: [true, 'Nama alamat harus diisi'],
    maxlength: [255, 'Panjang maksimal nama alamat adalah 255 karakter'],
  },
  village: {
    type: String,
    required: [true, 'Kelurahan harus diisi'],
    maxlength: [255, 'Panjang maksimal kelurahan adalah 255 karakter'],
  },
  district: {
    type: String,
    required: [true, 'Kecamatan harus diisi'],
    maxlength: [255, 'Panjang maksimal kecamatan adalah 255 karakter'],
  },
  regency: {
    type: String,
    required: [true, 'Kabupaten/kota harus diisi'],
    maxlength: [255, 'Panjang maksimal kabupaten/kota adalah 255 karakter'],
  },
  province: {
    type: String,
    required: [true, 'Provinsi harus diisi'],
    maxlength: [255, 'Panjang maksimal provinsi adalah 255 karakter'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
});

module.exports = model('DeliveryAddress', deliveryAddress);
