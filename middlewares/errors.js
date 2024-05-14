const ErrorHandler = require('../utils/errorHandler')

module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            success: false,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }

    if (process.env.NODE_ENV === 'production') {
        let error = { ...err }
        error.message = err.message

        // Wrong mongoose object ID error 
        if (err.name === 'CastError') {
            const message = `Resource not found, Invalid: ${err.path}`
            error = new ErrorHandler(message, 404)
        }

        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(v => v.message)
            error = new ErrorHandler(message, 400)
        }

        return res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }

}
