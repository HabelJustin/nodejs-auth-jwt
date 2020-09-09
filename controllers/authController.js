const User = require("../models/User");
const jwt = require("jsonwebtoken");

// errors constants
const DUPLICATE_EMAIL = 11000;

// handle client side error response
const handleErrors = (err) => {
	let othererror = true;
	let errors = {};
	if (err.message.includes("user validation failed")) {
		// field validation
		Object.values(err.errors).forEach(({ properties }) => (errors[`${properties.path}`] = `${properties.message}`));
		othererror = false;
	}

	if (err.message.includes("email not found")) {
		errors["email"] = "Email not found.";
		othererror = false;
	}

	if (err.message.includes("incorrect password")) {
		errors["password"] = "Incorrect password.";
		othererror = false;
	}

	if (err.code === DUPLICATE_EMAIL) {
		// duplicate email
		errors["email"] = "Email already been registered.";
		othererror = false;
	}

	if (err && othererror) {
		console.log(err);
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
		const user = await User.create({ email, password });
		const token = createToken(user._id);
		res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.status(201).json({ user: user._id });
	} catch (err) {
		res.status(400).json(handleErrors(err));
	}
};

const login_GET = (req, res) => {
	res.render("login");
};

const login_POST = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.login({ email, password });
		const token = createToken(user._id);
		res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.status(200).json({ user: user._id, redirectTo: req.cookies.redirectTo });
	} catch (err) {
		res.status(400).json(handleErrors(err));
	}
};

module.exports = {
	signUp_GET,
	signUp_POST,
	login_GET,
	login_POST,
	handleErrors,
};
