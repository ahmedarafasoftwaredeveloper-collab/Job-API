const jwt = require('jsonwebtoken');

const AppError = require('./appError');
const httpStatus = require('../utils/httpStatus');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers['authorization'];

  if (!authHeader) {
    const error = AppError.create(
      'No authorization header provided',
      401,
      httpStatus.FAIL
    );
    return next(error);
  }

  if (!authHeader.startsWith('Bearer ')) {
    const error = AppError.create(
      'Invalid authorization header format',
      401,
      httpStatus.FAIL
    );
    return next(error);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    const appError = AppError.create(
      'Invalid or expired token',
      401,
      httpStatus.FAIL
    );
    return next(appError);
  }
};

module.exports = verifyToken;
