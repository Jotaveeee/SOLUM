const express = require("express");

const router = express.Router();

const LeituraController = require("../controllers/LeituraController");

router.post("/", LeituraController.create);

module.exports = router;