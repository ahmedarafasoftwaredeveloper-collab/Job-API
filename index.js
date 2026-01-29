const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDb = require('./db/connect');
const authRouter = require('./routes/auth.route');
const jobsRouter = require('./routes/jobs.route');
const httpStatus = require('./utils/httpStatus');

const app = express();

connectDb();

app.use(express.json());
app.use(cors());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', jobsRouter);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const statusText = error.statusText || httpStatus.ERROR;

  res.status(statusCode).json({
    status: statusText,
    msg: error.message || 'Something went wrong',
    data: null,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});