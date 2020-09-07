const signUp_GET = (req, res) => {
	res.render("signup");
};

const signUp_POST = (req, res) => {
	console.log(req.body);
	res.send("signing up user");
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
