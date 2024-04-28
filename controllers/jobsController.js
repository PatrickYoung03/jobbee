const getJobs = (req, res, next) => {
    res.send({
        success: true,
        message: 'Listing all jobs'
    });
};

module.exports = {
    getJobs
}