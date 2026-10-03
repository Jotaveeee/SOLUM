const express = require("express");
const passport = require("passport");
const router = express.Router();
const FazendaController = require("../controllers/FazendaController");

// Buscar fazendas do usuário logado
router.get(
    "/me",
    passport.authenticate("jwt", { session: false }),
    (req, res) => FazendaController.me(req, res)
);

module.exports = router;