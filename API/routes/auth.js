const express = require("express");

const router = express.Router();

const passport = require("passport");

const AuthController = require("../controllers/AuthController");

// Cadastro
router.post("/register", AuthController.register);

// Login
router.post("/login", AuthController.login);

// Dados do usuário logado
router.get(
    "/me",
    passport.authenticate("jwt", { session: false }),
    AuthController.me
);

module.exports = router;
