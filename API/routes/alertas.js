const express = require("express");
const passport = require("passport");
const AlertaController = require("../controllers/AlertaController");

const router = express.Router();

router.get(
    "/me",
    passport.authenticate("jwt", { session: false }),
    (req, res) => AlertaController.me(req, res)
);

router.post(
    "/resolver",
    passport.authenticate("jwt", { session: false }),
    (req, res) => AlertaController.resolver(req, res)
);

module.exports = router;
