const express = require("express");
const passport = require("passport");
const router = express.Router();
const DeviceController = require("../controllers/DeviceController");
const DeviceSettingsController = require("../controllers/DeviceSettingsController");

// Configurações do protótipo autenticado.
router.get(
    "/:id/configuracoes",
    passport.authenticate("jwt", { session: false }),
    (req, res) => DeviceSettingsController.obter(req, res)
);

router.put(
    "/:id/configuracoes",
    passport.authenticate("jwt", { session: false }),
    (req, res) => DeviceSettingsController.atualizar(req, res)
);

// Cria um novo dispositivo, já vinculado à fazenda do usuário
router.post(
    "/criar",
    passport.authenticate("jwt", { session: false }),
    (req, res) => DeviceController.criar(req, res)
);

// Vincular dispositivo já existente a uma fazenda
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    DeviceController.register
);

// Buscar dispositivos do usuário logado
router.get(
    "/me",
    passport.authenticate("jwt", { session: false }),
    (req, res) => DeviceController.me(req, res)
);

// Deletar dispositivo do usuário logado
router.delete(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => DeviceController.delete(req, res)
);

module.exports = router;
