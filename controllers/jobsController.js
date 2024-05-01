const Job = require('../models/jobs')

const getJobs = async (req, res, next) => {

    const jobs = await Job.find();

    res.status(200).send({
        success: true,
        results: jobs.length,
        data: jobs
    });
};

const createJob = async (req, res, next) => {
    const job = await Job.create(req.body)

    res.status(200).json({
        success: true,
        message: 'Job created',
        data: job
    });

};

module.exports = {
    getJobs, createJob
}