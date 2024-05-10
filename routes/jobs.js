const { Router } = require('express');
const { getJobs, createJob, getJobsInRadius, updateJob, deleteJob, getJob, getStats } = require('../controllers/jobsController.js')


const router = Router();

router.route('/jobs').get(getJobs);

router.route('/job/new').post(createJob);

router.route('/jobs/:zipcode/:distance').get(getJobsInRadius);

router.route('/job/:id').put(updateJob).delete(deleteJob)

router.route('/job/:id/:slug').get(getJob);

router.route('/stats/:topic').get(getStats);

module.exports = router;
