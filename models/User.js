const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
	{
		createdAt: Number,
		updatedAt: Number,
		email: {
			type: String,
			required: [true, "Please enter an email."],
			unique: true,
			lowercase: true,
			validate: [isEmail, "Please enter a valid email."],
		},
		password: {
			type: String,
			required: [true, "Please enter an password"],
			minlength: [6, "Minimum password length is 6 characters."],
		},
	},
	{
		// Make Mongoose use Unix time (seconds since Jan 1, 1970)
		timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
	}
);

userSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

userSchema.statics.login = async function ({ email, password }) {
	const user = await this.findOne({ email });
	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		if (auth) {
			return user;
		}
		throw Error("incorrect password");
	}
	throw Error("email not found");
};

module.exports = model("user", userSchema);
