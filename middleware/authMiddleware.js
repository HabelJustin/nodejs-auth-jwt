const jwt = require("jsonwebtoken");

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

module.exports = requireAuth;
