const express = require('express');
const dotenv = require('dotenv');

const connectDatabase = require('./config/database')
const jobs = require('./routes/jobs')

const app = express();


const dotenvConfig = dotenv.config({ path: './config/config.env' })

connectDatabase();

app.use(express.json());

app.use('/api/v1', jobs)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT} in the ${process.env.NODE_ENV} environment`)
});