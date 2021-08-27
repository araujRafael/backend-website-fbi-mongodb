const dotenv = require('dotenv')
dotenv.config()
const { User } = require("../models/User")
const bcrypt = require("bcrypt")
const crypto = require('crypto')
const jwt = require("jsonwebtoken")
const authConfig = require("../../config/auth.js")
const mailer = require('../../modules/mailer')


const genToken = (params = {},) => {
	return jwt.sign(params, authConfig.secret, {
		expiresIn: 86400
	})
}

module.exports = server => {

	// REGISTER ======================================================

	server.get('/register', async (req, res) => {
		try {
			const user = await User.find()
			res.status(200).json(user)
		} catch (err) {
			// console.log(err);
			res.status(400).send({ error: "PAGE ERROR" })
		}
	})

	server.post('/register', async (req, res) => {
		const { email } = req.body
		try {
			if (await User.findOne({ email })) {
				res.status(400).send({ error: "User already exist!" });
			} else {
				const hash = await bcrypt.hash(req.body.password, 10)
				req.body.password = hash
				const user = await User.create(req.body)
				user.password = undefined
				res.status(200).send({
					user,
					token: genToken({ id: user.id })
				})
			}

		} catch (err) {
			res.status(400).send({ error: "User not register!" })
		}
	})// /register

	// AUTHENTICATE ======================================================

	server.post('/authenticate', async (req, res) => {
		const { email, password } = req.body
		const user = await User.findOne({ email }).select('+password')
		if (!user)
			return res.status(400).send({ error: "User not found!" })
		if (!await bcrypt.compare(password, user.password))
			return res.status(400).send({ error: "Invalid password!" })
		user.password = undefined
		res.send({
			user,
			token: genToken({ id: user.id })
		})
	})// /authenticate

	// FORGOT_PASSWORD ===================================================

	server.post('/forgot_password', async (req, res) => {
		const { email } = req.body
		try {
			const userEmail = await User.findOne({ email })

			if (!userEmail)
				return res.status(400).send({ error: "User not found!" })

			const token = crypto.randomBytes(20).toString('hex')

			const dateNow = new Date()
			dateNow.setHours(dateNow.getHours() + 1)

			await User.findByIdAndUpdate(userEmail.id, {
				'$set': {
					passResetToken: token,
					passResetExpires: dateNow,
				}
			})

			mailer.sendMail({
				to: email,
				from: process.env.EMAIL_FROM,
				// template: 'forgot_password',
				subject: "Troca de senha",
				context: { token },
				html: `<p>Se você esqueceu sua senha você pode troca-la usando esse token: 
				</p>
				<br>
				<p>${token}</p>
				`
			}, err => {
				if (err)
					console.log(err);
				res.status(400).send({ error: 'Error on forget password!' })
				return res.send()
			})

		} catch (err) {
			console.log(err);
			res.status(400).send({ error: 'Error on forgot password, try again!' })
		}
	})// Forgot_password

	// RESET_PASSWORD ====================================================

	server.post("/reset_password", async (req, res) => {
		const { email, token, password } = req.body
		try {
			// Find user in database!
			const user = await User.findOne({ email })
				.select('+passResetToken passResetExpires')
			// if user dont exist or user dont have valid token!
			if (!user)
				return res.status(400).send({ error: 'User cannot found!' })
			if (token !== user.passResetToken)
				return res.status(400).send({ error: 'Token invalid' })
			//konw token expired.
			const now = new Date()
			if (now > user.passResetExpires)
				return res.status(400).send({ error: "Token expired, generate new token." })
			//Attribute new password to user.
			const hash = await bcrypt.hash(password, 10)
			user.password = hash
			//Save user.
			user.save()
			res.send()
		} catch (err) {
			res.status(400).send({ error: "Cannot reset password, try again!" })
		}
	})// /reset_password



}