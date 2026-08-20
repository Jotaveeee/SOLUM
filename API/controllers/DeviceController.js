const Dispositivo = require("../models/Dispositivo");

class DeviceController {

    formatarDispositivo(dispositivo) {
        return {
            id: dispositivo._id,
            deviceId: dispositivo.deviceId,
            vinculado: dispositivo.vinculado,
            ativo: dispositivo.ativo,
            createdAt: dispositivo.createdAt
        };
    }

    async register(req, res) {
    try {
        const { deviceId } = req.body;
        const usuario = req.user;

        if (!deviceId) {
            return res.status(400).json({
                message: "Informe o Device ID."
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

            const dispositivo = await Dispositivo.findOne({
                usuario: req.user._id
            });

            if (!dispositivo) {
                return res.status(404).json({
                    message: "Nenhum dispositivo encontrado."
                });
            }

            return res.status(200).json({
                dispositivo: this.formatarDispositivo(dispositivo)
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