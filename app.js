const express = require('express');
const dotenv = require('dotenv')

// Routes
const jobs = require('./routes/jobs')

const app = express();

dotenv.config({ path: './config/config.env' })

app.use('/api/v1', jobs)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT} in the ${process.env.NODE_ENV} environment`)
});