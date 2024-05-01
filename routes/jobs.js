const { Router } = require('express');
const { getJobs, createJob } = require('../controllers/jobsController.js')


const router = Router();

router.route('/jobs').get(getJobs);
router.route('/job/new').post(createJob);

module.exports = router;
