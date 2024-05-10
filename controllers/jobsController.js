const Job = require('../models/jobs')
const geoCoder = require('../utils/geocoder')

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

const getJobsInRadius = async (req, res, next) => {
    const { zipcode, distance } = req.params

    const loc = await geoCoder.geocode(zipcode)
    const latitude = loc[0].latitude
    const longitude = loc[0].longitude

    const radius = distance / 3663

    const jobs = await Job.find({
        location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } },
    })

    res.status(200).send({
        success: true,
        results: jobs.length,
        data: jobs
    });
}

const updateJob = async (req, res, next) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404).json({
            success: false,
            message: 'No job found with that ID'
        });
    };

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        message: 'Job updated',
        data: job
    });
};

const deleteJob = async (req, res, next) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404).json({
            success: false,
            message: 'No job found with that ID'
        });
    };

    await Job.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: 'Job deleted'
    });
};

const getJob = async (req, res, next) => {
    let job = await Job.find({
        $and: [
            { _id: req.params.id },
            { slug: req.params.slug }
        ]
    });

    if (!job || job.length === 0) {
        res.status(404).json({
            success: false,
            message: 'No job found with that ID'
        });
    };

    res.status(200).json({
        success: true,
        message: 'Job found',
        data: job
    });
};

const getStats = async (req, res, next) => {

    const stats = await Job.aggregate([
        {
            $match: {
                $text: { $search: "\"" + req.params.topic + "\"" }
            }
        },
        {
            $group: {
                _id: { $toUpper: '$experience' },
                avgSalary: { $avg: '$salary' },
                minSalary: { $min: '$salary' },
                maxSalary: { $max: '$salary' },
                totalJobs: { $sum: 1 },
                avgPosition: { $avg: '$positions' }
            }
        }
    ])

    if (!stats) {
        res.status(404).json({
            success: false,
            message: 'No stats found'
        });
    }

    res.status(200).json({
        success: true,
        message: 'Successfully found stats',
        data: stats
    });
};

module.exports = {
    getJobs,
    createJob,
    getJobsInRadius,
    updateJob,
    deleteJob,
    getJob,
    getStats
}
