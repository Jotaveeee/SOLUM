const express = require("express");
const router = express.Router();
const passport = require("passport");
const AuthController = require("../controllers/AuthController");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get(
    "/me",
    passport.authenticate("jwt", { session: false }),
    AuthController.me
);


module.exports = router;