const dotenv = require('dotenv');
const nodeGeocoder = require("node-geocoder")

dotenv.config({ path: './config/config.env' })

const options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
}

const geocoder = nodeGeocoder(options)

module.exports = geocoder
