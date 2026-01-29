const asyncHandler = require('express-async-handler');

const User = require('../models/user.model');
const AppError = require('../middlewares/appError');
const httpStatus = require('../utils/httpStatus');

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = AppError.create(
      'Please provide all required fields',
      400,
      httpStatus.FAIL
    );
    return next(error);
  }

  const user = await User.create({ name, email, password });
  const token = await user.createJWT();

  res.status(201).json({
    status: httpStatus.SUCCESS,
    msg: 'User registered successfully',
    data: { user },
    token,
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = AppError.create(
      'Please provide email and password',
      400,
      httpStatus.FAIL
    );
    return next(error);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    const error = AppError.create(
      'Invalid email or password',
      401,
      httpStatus.FAIL
    );
    return next(error);
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    const error = AppError.create(
      'Invalid email or password',
      401,
      httpStatus.FAIL
    );
    return next(error);
  }

  const token = await user.createJWT();

  res.status(200).json({
    status: httpStatus.SUCCESS,
    msg: 'Login successful',
    data: { user },
    token,
  });
});

module.exports = {
  register,
  login,
};
