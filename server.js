const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// init dotenv
dotenv.config({ path: "./config/.env" });

const app = express();

// middleware
app.use(express.static("public"));

// view engine
app.set("view engine", "ejs");

// body parser
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// routes
app.use("/", require("./routes"));

// database connection
const dbURI = process.env.mongodbURI;
const PORT = process.env.PORT || 3000;
mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.catch((err) => console.log(err));

mongoose.connection.once("open", () => console.log("Connected to database!"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
