const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const AutoIncrement = require('mongoose-sequence')(mongoose);

const HASH_ROUND = 10;

const usersSchema = new Schema(
  {
    full_name: {
      type: String,
      required: [true, 'Nama harus diisi'],
      maxlength: [255, 'Panjang nama harus antara 3 - 255 karakter'],
      minlength: [3, 'Panjang nama harus antara 3 - 255 karakter'],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, 'Email harus diisi'],
      maxlength: [255, 'Panjang email maksimal 255 karakter'],
    },
    password: {
      type: String,
      required: [true, 'Password harus diisi'],
      maxlength: [255, 'Panjang password maksimal 255 karakter'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    token: [String],
  },
  { timestamps: true },
);

usersSchema.path('email').validate(
  (value) => {
    const EMAIL_RE = /^([\w.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
  },
  (attr) => `${attr.value} harus email yang valid!`,
);

usersSchema.path('email').validate(async function (value) {
  try {
    const count = await this.model('Users').count({ email: value });
    return !count;
  } catch (error) {
    return error;
  }
});

usersSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

usersSchema.plugin(AutoIncrement, { inc_field: 'customer_id' });

module.exports = model('Users', usersSchema);
