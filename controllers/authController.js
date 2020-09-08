const User = require("../models/User");
const jwt = require("jsonwebtoken");

// errors constants
const DUPLICATE_EMAIL = 11000;

// handle client side error response
const handleErrors = (err) => {
	let errors = {};
	if (err.message.includes("user validation failed")) {
		// field validation
		Object.values(err.errors).forEach(({ properties }) => (errors[`${properties.path}`] = `${properties.message}`));
	} else if (err.code === DUPLICATE_EMAIL) {
		// duplicate email
		errors["email"] = "Email already been registered.";
	} else {
		errors = [{ message: "Internal Server Error. Request Failed." }];
	}
	return { errors };
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
	return jwt.sign({ id }, process.env.jwtSecretKey, { expiresIn: maxAge });
};

const signUp_GET = (req, res) => {
	res.render("signup");
};

const signUp_POST = async (req, res) => {
	const { email, password } = req.body;

	try {
		const userResult = await User.create({ email, password });
		const token = createToken(userResult._id);
		res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.status(201).json({ user: userResult._id });
	} catch (err) {
		res.status(500).json(handleErrors(err));
	}
};

const login_GET = (req, res) => {
	res.render("login");
};

const login_POST = (req, res) => {
	res.send("logging user");
};

module.exports = {
	signUp_GET,
	signUp_POST,
	login_GET,
	login_POST,
};
