const { Router } = require('express');
const { getJobs } = require('../controllers/jobsController.js')


const router = Router();

router.route('/jobs').get(getJobs)

module.exports = router;
