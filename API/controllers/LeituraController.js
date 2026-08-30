const Dispositivo = require("../models/Dispositivo");
const Leitura = require("../models/Leitura");

class LeituraController {

    // ESP32 envia uma leitura
    async create(req, res) {

        try {

            const {
                deviceId,
                apiKey,
                temperatura,
                umidadeSolo,
                bateria
            } = req.body;

            // Verifica se todos os dados foram enviados
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

            // Procura o dispositivo
            const dispositivo = await Dispositivo.findOne({
                deviceId
            });

            if (!dispositivo) {
                return res.status(404).json({
                    message: "Dispositivo não encontrado."
                });
            }

            // Verifica se o dispositivo está ativo
            if (!dispositivo.ativo) {
                return res.status(403).json({
                    message: "Dispositivo desativado."
                });
            }

            // Verifica a API Key
            if (dispositivo.apiKey !== apiKey) {
                return res.status(401).json({
                    message: "API Key inválida."
                });
            }

            // Atualiza a última conexão
            dispositivo.ultimaConexao = new Date();

            await dispositivo.save();

            // Salva a leitura vinculada ao dispositivo
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


    // Aplicativo busca as leituras
    async me(req, res) {

        try {

            // Busca todos os dispositivos do usuário logado
            const dispositivos = await Dispositivo.find({
                usuario: req.user._id
            });

            // Pega somente os IDs dos dispositivos
            const dispositivosIds = dispositivos.map(
                dispositivo => dispositivo._id
            );

            // Busca as leituras desses dispositivos
            const leituras = await Leitura.find({
                dispositivo: {
                    $in: dispositivosIds
                }
            }).sort({
                createdAt: -1
            });

            return res.status(200).json({
                leituras
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