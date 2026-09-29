const Dispositivo = require("../models/Dispositivo");
const Fazenda = require("../models/Fazenda");
const crypto = require("crypto");

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

    // Cria um dispositivo NOVO, já vinculado à fazenda do usuário
    async criar(req, res) {
        try {
            const { deviceId, fazendaNome } = req.body;
            const usuario = req.user;

            if (!deviceId) {
                return res.status(400).json({ message: "Informe o Device ID." });
            }

            // Verifica se o usuário já tem uma fazenda; se não, cria uma
            let fazenda = await Fazenda.findOne({ usuario: usuario._id });

            if (!fazenda) {
                fazenda = await Fazenda.create({
                    nome: fazendaNome || "Minha Fazenda",
                    usuario: usuario._id
                });
            }

            // Verifica se o deviceId já existe
            const existente = await Dispositivo.findOne({ deviceId });
            if (existente) {
                return res.status(409).json({ message: "Este Device ID já existe." });
            }

            const apiKey = crypto.randomBytes(16).toString("hex");

            const dispositivo = await Dispositivo.create({
                deviceId,
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

            const dispositivos = await Dispositivo.find({
                usuario: req.user._id
            });

            if (dispositivos.length === 0) {

                return res.status(404).json({
                    message: "Nenhum dispositivo encontrado."
                });
            }

            return res.status(200).json({

                dispositivos: dispositivos.map(
                    dispositivo => this.formatarDispositivo(dispositivo)
                )

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: "Erro interno do servidor."
            });
        }
    }
}

module.exports = new DeviceController();