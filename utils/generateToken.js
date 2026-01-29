const jwt = require('jsonwebtoken');

const generateToken = async (payload) => {
  return await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;