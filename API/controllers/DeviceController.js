const Dispositivo = require("../models/Dispositivo");
const Fazenda = require("../models/Fazenda");

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

    async register(req, res) {

        try {

            const { deviceId, fazendaId } = req.body;

            const usuario = req.user;

            // Verifica se os dados foram enviados
            if (!deviceId || !fazendaId) {

                return res.status(400).json({
                    message: "Informe o Device ID e a Fazenda."
                });
            }

            // Verifica se a fazenda existe
            const fazenda = await Fazenda.findOne({
                _id: fazendaId,
                usuario: usuario._id
            });

            if (!fazenda) {

                return res.status(404).json({
                    message: "Fazenda não encontrada ou não pertence ao usuário."
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

            // Verifica se já está vinculado
            if (dispositivo.vinculado) {

                return res.status(409).json({
                    message: "Este dispositivo já está vinculado a outra conta."
                });
            }

            // Vincula ao usuário
            dispositivo.usuario = usuario._id;

            // Vincula à fazenda
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