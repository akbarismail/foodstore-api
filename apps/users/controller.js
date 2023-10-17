const bcrypt = require('bcryptjs');
const passport = require('passport');
const jsonwebtoken = require('jsonwebtoken');
const config = require('../config');
const Users = require('./model');
const { getToken } = require('../utils/get-token');

async function register(req, res, next) {
  try {
    const payload = req.body;
    const users = await new Users(payload).save();
    return res.json(users);
  } catch (error) {
    if (error && error.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next();
  }

  return true;
}

async function localStrategy(email, password, done) {
  try {
    const user = await Users.findOne({ email }).select('-__v -createdAt -updatedAt -cart_items -token');
    if (!user) return done();
    if (bcrypt.compareSync(password, user.password)) {
      const { withPassword, ...userWithoutPassword } = user.toJSON();
      return done(null, userWithoutPassword);
    }
  } catch (err) {
    done(err, null);
  }
  done();
  return true;
}

async function login(req, res, next) {
  passport.authenticate('local', async (err, user) => {
    if (err) return next(err);
    if (!user) return res.json({ error: 1, message: 'email or password incorrect' });

    // create json web token
    const signed = jsonwebtoken.sign(user, config.secretKey);
    await Users.findOneAndUpdate({ _id: user._id }, { $push: { token: signed } }, { new: true });
    return res.json({
      message: 'logged in successfully',
      user,
      token: signed,
    });
  })(req, res, next);
}

function me(req, res) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: "You're not login or token expired",
    });
  }
  return res.json(req.user);
}

async function logout(req, res) {
  const token = getToken(req);
  const user = await Users.findOneAndUpdate(
    { token: { $in: [token] } },
    { $pull: { token } },
    { useFindAndModify: false },
  );
  if (!user || !token) {
    return res.json({
      error: 1,
      message: 'No user found',
    });
  }
  return res.json({
    error: 0,
    message: 'Logout success',
  });
}

module.exports = {
  register,
  localStrategy,
  login,
  me,
  logout,
};
