const express = require('express');

const verifyToken = require('../middlewares/auth.middleware');
const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobs.controller');

const router = express.Router();

router.use(verifyToken);

router.route('/').get(getAllJobs).post(createJob);
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;
