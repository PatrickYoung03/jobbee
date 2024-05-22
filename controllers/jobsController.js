const Job = require('../models/jobs');
const ErrorHandler = require('../utils/errorHandler');
const APIFilters = require('../utils/apiFilters');
const geoCoder = require('../utils/geocoder');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')

const getJobs = catchAsyncErrors(async (req, res, next) => {

    // Apply filters
    const apiFilters = new APIFilters(Job.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .searchByQuery()
        .pagination();

    const jobs = await apiFilters.query;

    return res.status(200).send({
        success: true,
        results: jobs.length,
        data: jobs
    });
});

const createJob = catchAsyncErrors(async (req, res, next) => {

    const job = await Job.create(req.body)

    return res.status(200).json({
        success: true,
        message: 'Job created',
        data: job
    });

});

const getJobsInRadius = catchAsyncErrors(async (req, res, next) => {
    const { zipcode, distance } = req.params

    const loc = await geoCoder.geocode(zipcode)
    const latitude = loc[0].latitude
    const longitude = loc[0].longitude

    const radius = distance / 3663

    const jobs = await Job.find({
        location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } },
    });

    return res.status(200).send({
        success: true,
        results: jobs.length,
        data: jobs
    });
});

const updateJob = catchAsyncErrors(async (req, res, next) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        return next(new ErrorHandler('Job not found', 404));
    };

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    return res.status(200).json({
        success: true,
        message: 'Job updated',
        data: job
    });
});

const deleteJob = catchAsyncErrors(async (req, res, next) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        return next(new ErrorHandler('Job not found', 404));
    };

    await Job.findByIdAndDelete(req.params.id)

    return res.status(200).json({
        success: true,
        message: 'Job deleted'
    });
});

const getJob = catchAsyncErrors(async (req, res, next) => {
    let job = await Job.find({
        $and: [
            { _id: req.params.id },
            { slug: req.params.slug }
        ]
    });

    if (!job || job.length === 0) {
        return next(new ErrorHandler('Job not found', 404));
    };

    return res.status(200).json({
        success: true,
        message: 'Job found',
        data: job
    });
});

const getStats = catchAsyncErrors(async (req, res, next) => {
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
    ]);

    if (!stats) {
        return next(new ErrorHandler('Stats not found', 404));
    }

    return res.status(200).json({
        success: true,
        message: 'Successfully found stats',
        data: stats
    });
});

module.exports = {
    getJobs,
    createJob,
    getJobsInRadius,
    updateJob,
    deleteJob,
    getJob,
    getStats
};
