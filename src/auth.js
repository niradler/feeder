const { generateSecret } = require('@statikly-stack/core/build/utils/common')
const jwt = require('jsonwebtoken');

const apiKey = process.env.API_KEY || generateSecret();
const JWTSecret = process.env.JWT_SECRET || generateSecret();
const Password = process.env.FEEDER_PASSWORD || generateSecret();

console.log("Api key is:", apiKey)
console.log("Password is:", Password)

const verifyApiKey = (req, res, done) => {
    const key = req.headers['authorization'];
    if (key !== apiKey) {
        done(res.httpErrors().unauthorized())
    }
    done();
}

const verifyToken = (req, res, done) => {
    const token = req.cookies.feeder_token;

    try {
        const decoded = jwt.verify(token, JWTSecret);
        req.userData = decoded;
        done();
    } catch (error) {
        req.log.error(`verifyToken error: ${error.message}`)
        res.redirect("/auth/login")
    }
}

const generateToken = (data = {}) => {
    return jwt.sign({
        data
    }, JWTSecret, { expiresIn: '24h' });
}


const verifyPassword = (password) => {
    if (password === Password) {
        return generateToken()
    }
    throw new Error('Invalid password')
}

module.exports = { verifyApiKey, verifyToken, verifyPassword }