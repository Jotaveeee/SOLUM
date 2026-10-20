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

// Atualiza os dados do usuário autenticado
router.patch(
    "/me",
    passport.authenticate("jwt", { session: false }),
    AuthController.updateMe
);

// Exclui a conta autenticada e os dados associados
router.delete(
    "/me",
    passport.authenticate("jwt", { session: false }),
    AuthController.deleteMe
);

module.exports = router;
