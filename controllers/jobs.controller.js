const asyncHandler = require('express-async-handler');

const Job = require('../models/jobs.model');
const AppError = require('../middlewares/appError');
const httpStatus = require('../utils/httpStatus');

const getAllJobs = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;

  const jobs = await Job.find({ createdBy: userId }).sort({ createdAt: -1 });

  res.status(200).json({
    status: httpStatus.SUCCESS,
    msg: 'Jobs retrieved successfully',
    count: jobs.length,
    data: { jobs },
  });
});

const getJob = asyncHandler(async (req, res, next) => {
  const { id: jobId } = req.params;
  const { id: userId } = req.user;

  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    const error = AppError.create(
      'Job not found',
      404,
      httpStatus.FAIL
    );
    return next(error);
  }

  res.status(200).json({
    status: httpStatus.SUCCESS,
    msg: 'Job retrieved successfully',
    data: { job },
  });
});

const createJob = asyncHandler(async (req, res, next) => {
  const { company, position } = req.body;
  const { id: userId } = req.user;

  if (!company || !position) {
    const error = AppError.create(
      'Please provide company and position',
      400,
      httpStatus.FAIL
    );
    return next(error);
  }

  const job = await Job.create({
    company,
    position,
    createdBy: userId,
    ...req.body,
  });

  res.status(201).json({
    status: httpStatus.SUCCESS,
    msg: 'Job created successfully',
    data: { job },
  });
});

const updateJob = asyncHandler(async (req, res, next) => {
  const { company, position } = req.body;
  const { id: jobId } = req.params;
  const { id: userId } = req.user;

  if (!company || !position) {
    const error = AppError.create(
      'Please provide company and position',
      400,
      httpStatus.FAIL
    );
    return next(error);
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    const error = AppError.create(
      'Job not found',
      404,
      httpStatus.FAIL
    );
    return next(error);
  }

  res.status(200).json({
    status: httpStatus.SUCCESS,
    msg: 'Job updated successfully',
    data: { job },
  });
});

const deleteJob = asyncHandler(async (req, res, next) => {
  const { id: jobId } = req.params;
  const { id: userId } = req.user;

  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });

  if (!job) {
    const error = AppError.create(
      'Job not found',
      404,
      httpStatus.FAIL
    );
    return next(error);
  }

  res.status(200).json({
    status: httpStatus.SUCCESS,
    msg: 'Job deleted successfully',
    data: {},
  });
});

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
