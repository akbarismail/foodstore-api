const { Schema, model } = require('mongoose');

const deliveryAddress = new Schema({
  nama_alamat: {
    type: String,
    required: [true, 'Nama alamat harus diisi'],
    maxlength: [255, 'Panjang maksimal nama alamat adalah 255 karakter'],
  },
  kelurahan: {
    type: String,
    required: [true, 'Kelurahan harus diisi'],
    maxlength: [255, 'Panjang maksimal kelurahan adalah 255 karakter'],
  },
  kecamatan: {
    type: String,
    required: [true, 'Kecamatan harus diisi'],
    maxlength: [255, 'Panjang maksimal kecamatan adalah 255 karakter'],
  },
  kabupaten: {
    type: String,
    required: [true, 'Kabupaten/kota harus diisi'],
    maxlength: [255, 'Panjang maksimal kabupaten/kota adalah 255 karakter'],
  },
  provinsi: {
    type: String,
    required: [true, 'Provinsi harus diisi'],
    maxlength: [255, 'Panjang maksimal provinsi adalah 255 karakter'],
  },
  detail_alamat: {
    type: String,
    required: [true, 'Detail alamat harus diisi'],
    maxLength: [1000, 'Panjang maksimal detail alamat adalah 1000 karakter'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
}, { timestamps: true });

module.exports = model('DeliveryAddress', deliveryAddress);
