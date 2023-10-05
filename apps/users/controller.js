const Users = require('./model');

async function register(req, res, next) {
  try {
    let payload = req.body;
    let users = await new Users(payload).save();
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
}

module.exports = {
  register,
};
