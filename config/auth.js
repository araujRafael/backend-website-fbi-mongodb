const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    secret:process.env.AUTH_SECRET
}