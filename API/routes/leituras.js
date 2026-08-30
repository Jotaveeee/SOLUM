const express = require("express");

const router = express.Router();

const passport = require("passport");

const LeituraController = require("../controllers/LeituraController");

// ESP32 envia uma leitura
router.post(
    "/",
    LeituraController.create
);

// Aplicativo busca as leituras
router.get(
    "/me",
    passport.authenticate("jwt", { session: false }),
    LeituraController.me
);

module.exports = router;