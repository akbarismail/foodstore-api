const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const bcrypt = require('bcryptjs');

const usersSchema = new Schema(
  {
    full_name: {
      type: String,
      required: [true, 'Nama harus diisi'],
      maxlength: [255, 'Panjang nama harus antara 3 - 255 karakter'],
      minlength: [3, 'Panjang nama harus antara 3 - 255 karakter'],
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

const saltRounds = 10;

usersSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

module.exports = model('Users', usersSchema);
