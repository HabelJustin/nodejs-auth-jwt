const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
	const jwtCookie = req.cookies.jwt;

	try {
		const decodedJWT = jwt.verify(jwtCookie, process.env.jwtSecretKey);
		if (decodedJWT.id) {
			next();
		}
	} catch (err) {
		console.log(err.message);
		res.cookie("redirectTo", req.route.path, { httpOnly: true });
		res.redirect("/login");
	}
};

const checkUser = async (req, res, next) => {
	const jwtCookie = req.cookies.jwt;
	if (jwtCookie) {
		try {
			const decodedJWT = jwt.verify(jwtCookie, process.env.jwtSecretKey);
			if (decodedJWT.id) {
				const user = await User.findById(decodedJWT.id);
				res.locals.user = user;
				next();
			}
		} catch (err) {
			console.log(err.message);
			res.locals.user = null;
			next();
		}
	} else {
		res.locals.user = null;
		next();
	}
};

module.exports = { requireAuth, checkUser };
