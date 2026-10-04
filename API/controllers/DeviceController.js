const Dispositivo = require("../models/Dispositivo");
const Fazenda = require("../models/Fazenda");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Leitura = require("../models/Leitura");

class DeviceController {

    formatarDispositivo(dispositivo) {
        return {
            id: dispositivo._id,
            deviceId: dispositivo.deviceId,
            fazenda: dispositivo.fazenda,
            vinculado: dispositivo.vinculado,
            ativo: dispositivo.ativo,
            createdAt: dispositivo.createdAt
        };
    }

    // Cria um dispositivo novo
    async criar(req, res) {
        try {
            const { deviceId, fazendaId } = req.body;
            const usuario = req.user;

            if (typeof deviceId !== "string" || !deviceId.trim() || !fazendaId) {
                return res.status(400).json({ message: "Informe o Device ID e a Fazenda." });
            }

            if (!mongoose.isValidObjectId(fazendaId)) {
                return res.status(400).json({ message: "Fazenda inválida." });
            }

            const fazenda = await Fazenda.findOne({ _id: fazendaId, usuario: usuario._id });
            if (!fazenda) {
                return res.status(404).json({ message: "Fazenda não encontrada." });
            }

            const idLimpo = deviceId.trim();

            const existente = await Dispositivo.findOne({ deviceId: idLimpo });
            if (existente) {
                return res.status(409).json({ message: "Este Device ID já existe." });
            }

            const apiKey = crypto.randomBytes(16).toString("hex");

            const dispositivo = await Dispositivo.create({
                deviceId: idLimpo,
                apiKey,
                fazenda: fazenda._id,
                usuario: usuario._id,
                vinculado: true,
                ativo: true
            });

            return res.status(201).json({
                message: "Dispositivo criado com sucesso.",
                dispositivo: this.formatarDispositivo(dispositivo),
                apiKey
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({ message: "Este Device ID já existe." });
            }
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    async register(req, res) {

        try {

            const { deviceId, fazendaId } = req.body;

            const usuario = req.user;

            if (!deviceId || !fazendaId) {

                return res.status(400).json({
                    message: "Informe o Device ID e a Fazenda."
                });
            }

            const fazenda = await Fazenda.findOne({
                _id: fazendaId,
                usuario: usuario._id
            });

            if (!fazenda) {

                return res.status(404).json({
                    message: "Fazenda não encontrada ou não pertence ao usuário."
                });
            }

            const dispositivo = await Dispositivo.findOne({
                deviceId
            });

            if (!dispositivo) {

                return res.status(404).json({
                    message: "Dispositivo não encontrado."
                });
            }

            if (dispositivo.vinculado) {

                return res.status(409).json({
                    message: "Este dispositivo já está vinculado a outra conta."
                });
            }

            dispositivo.usuario = usuario._id;
            dispositivo.fazenda = fazenda._id;
            dispositivo.vinculado = true;

            await dispositivo.save();

            return res.status(200).json({

                message: "Dispositivo vinculado com sucesso.",

                dispositivo: this.formatarDispositivo(dispositivo)

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: "Erro interno do servidor."
            });
        }
    }


    async me(req, res) {
        try {
            const filtro = { usuario: req.user._id };

            if (req.query.fazenda) {

                if (!mongoose.isValidObjectId(req.query.fazenda)) {
                    return res.status(400).json({ message: "Fazenda inválida." });
                }

                filtro.fazenda = req.query.fazenda;
            }

            const dispositivos = await Dispositivo.find(filtro).populate("fazenda", "nome");

            return res.status(200).json({
                dispositivos: dispositivos.map(d => this.formatarDispositivo(d))
            });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: "Dispositivo inválido." });
            }

            const dispositivo = await Dispositivo.findOne({
                _id: id,
                usuario: req.user._id
            });

            if (!dispositivo) {
                return res.status(404).json({ message: "Dispositivo não encontrado." });
            }

            // remove as leituras e dispositivo
            await Leitura.deleteMany({ dispositivo: dispositivo._id });
            await dispositivo.deleteOne();

            return res.status(200).json({ message: "Dispositivo removido com sucesso." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }
}

module.exports = new DeviceController();