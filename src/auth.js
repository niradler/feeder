const { generateSecret } = require('@statikly-stack/core/build/utils/common')

const apiKey = process.env.API_KEY || generateSecret()

console.log("Api key is:", apiKey)

const verifyApiKey = (req, res, done) => {
    const key = req.headers['authorization'];
    if (key !== apiKey) {
        done(feederApp.httpErrors.unauthorized())
    }
    done();
}


module.exports = { verifyApiKey }