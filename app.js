const express = require('express');
const dotenv = require('dotenv');

const connectDatabase = require('./config/database')
const errorMiddleware = require('./middlewares/errors')
const ErrorHandler = require('./utils/errorHandler')
const jobs = require('./routes/jobs')

const app = express();


dotenv.config({ path: './config/config.env' })

//Handle uncaught exeception
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down server due to uncaught exception.');
    process.exit(1);
})

connectDatabase();

app.use(express.json());
app.use('/api/v1', jobs);

// Handle non existing routes
app.all('*', (req, res, next) => {
    next(new ErrorHandler('Not found', 404));
})

app.use(errorMiddleware);

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT} in the ${process.env.NODE_ENV} environment`)
});

// Handle unhandled Promise rejection 
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down server due to Unhandled promise rejection.');
    server.close(() => {
        process.exit(1)
    });
});
