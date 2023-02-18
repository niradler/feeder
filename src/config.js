const { generateSecret } = require('@statikly-stack/core/build/utils/common')
const config = require('../config.json');

const apiKey = process.env.API_KEY || generateSecret();
const JWTSecret = process.env.JWT_SECRET || generateSecret();
const Password = process.env.FEEDER_PASSWORD || generateSecret();
const sessionSecret = process.env.SESSION_SECRET || generateSecret();

if (process.env.API_KEY != apiKey) console.log("Api key is:", apiKey)
if (process.env.FEEDER_PASSWORD != Password) console.log("Password is:", Password)

module.exports = {
    ...config,
    sessionSecret,
    JWTSecret,
    Password,
    apiKey,
}