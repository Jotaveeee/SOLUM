const Dispositivo = require("../models/Dispositivo");
const Leitura = require("../models/Leitura");

class LeituraController {

    async create(req, res) {

        try {

            const {
                deviceId,
                apiKey,
                temperatura,
                umidadeSolo,
                bateria
            } = req.body;

            if (
                !deviceId ||
                !apiKey ||
                temperatura == null ||
                umidadeSolo == null ||
                bateria == null
            ) {
                return res.status(400).json({
                    message: "Dados incompletos."
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

            if (!dispositivo.ativo) {
                return res.status(403).json({
                    message: "Dispositivo desativado."
                });
            }

            if (dispositivo.apiKey !== apiKey) {
                return res.status(401).json({
                    message: "API Key inválida."
                });
            }

            dispositivo.ultimaConexao = new Date();

            await dispositivo.save();

            const leitura = await Leitura.create({
                dispositivo: dispositivo._id,
                temperatura,
                umidadeSolo,
                bateria
            });

            return res.status(201).json({
                message: "Leitura salva com sucesso.",
                leitura
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: "Erro interno do servidor."
            });

        }

    }

}

module.exports = new LeituraController();