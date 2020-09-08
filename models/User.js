const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new Schema(
	{
		createdAt: Number,
		updatedAt: Number,
		email: {
			type: String,
			required: [true, "Please enter an email"],
			unique: true,
			lowercase: true,
			validate: [isEmail, "Please enter a valid email"],
		},
		password: {
			type: String,
			required: [true, "Please enter an password"],
			minlength: [6, "Minimum password length is 6 characters"],
		},
	},
	{
		// Make Mongoose use Unix time (seconds since Jan 1, 1970)
		timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
	}
);

module.exports = model("user", userSchema);
