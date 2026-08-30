const express = require("express");

const passport = require("passport");

const router = express.Router();

const DeviceController = require("../controllers/DeviceController");

// Vincular dispositivo a uma fazenda
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    DeviceController.register
);

// Buscar dispositivos do usuário logado
router.get(
    "/me",
    passport.authenticate("jwt", { session: false }),
    DeviceController.me
);

module.exports = router;
