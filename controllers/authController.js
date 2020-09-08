const User = require("../models/User");

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

const signUp_GET = (req, res) => {
	res.render("signup");
};

const signUp_POST = async (req, res) => {
	const { email, password } = req.body;

	try {
		const userResult = await User.create({ email, password });
		res.status(201).json(userResult);
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
