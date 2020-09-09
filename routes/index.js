const express = require("express");
const router = express.Router();
const { signUp_GET, signUp_POST, login_GET, login_POST, logout_GET } = require("../controllers/authController");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");

// @GET
// @Desc - check current user (if any)
router.get("*", checkUser);

// @GET
// @Desc - display Homepage
router.get("/", (req, res) => res.render("home"));

// @GET
// @Desc - display Signup
router.get("/signup", signUp_GET);

// @POST
// @Desc - signing up new user
router.post("/signup", signUp_POST);

// @GET
// @Desc - display Login
router.get("/login", login_GET);

// @POST
// @Desc - logging user
router.post("/login", login_POST);

// @GET
// @Desc - logout current user
router.get("/logout", logout_GET);

// @POST
// @Desc - display Smoothies
router.get("/smoothies", requireAuth, (req, res) => {
	res.render("smoothies");
});

module.exports = router;
