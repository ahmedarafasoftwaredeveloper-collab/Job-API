const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
      minlength: [3, 'Company name must be at least 3 characters'],
      maxlength: [50, 'Company name cannot exceed 50 characters'],
    },
    position: {
      type: String,
      required: [true, 'Please provide a position'],
      minlength: [3, 'Position must be at least 3 characters'],
      maxlength: [100, 'Position cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['interview', 'declined', 'pending'],
        message: 'Status must be one of: interview, declined, pending',
      },
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Job', jobSchema);
