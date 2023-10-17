const { verify } = require('jsonwebtoken');
const { getToken } = require('../utils/get-token');
const { secretKey } = require('../config');
const Users = require('../users/model');

function decodeToken() {
  return async function (req, res, next) {
    try {
      const token = getToken(req);

      if (!token) return next();

      req.user = verify(token, secretKey);

      const user = await Users.findOne({ token: { $in: [token] } });
      if (!user) {
        return res.json({
          error: 1,
          message: 'Token expired',
        });
      }
    } catch (err) {
      if (err && err.name === 'JsonWebTokenError') {
        return res.json({
          err: 1,
          message: err.message,
        });
      }
      next(err);
    }
    return next();
  };
}

module.exports = {
  decodeToken,
};
