const express = require("express");
const passport = require("passport");

const router = express.Router();

const DeviceController = require("../controllers/DeviceController");

router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    DeviceController.register
);

router.get(
    "/me",
    passport.authenticate("jwt", { session: false }),
    DeviceController.me
);

module.exports = router;