const mongoose = require("mongoose");
const Dispositivo = require("../models/Dispositivo");

const LIMITES_PADRAO = {
    umidade: { atencaoMinima: 40, atencaoMaxima: 73, criticaMinima: 20, criticaMaxima: 80 },
    temperatura: { atencaoMinima: 20, atencaoMaxima: 30, criticaMinima: 15, criticaMaxima: 40 }
};

const lerFaixa = (faixa, limites, minimoPossivel, maximoPossivel) => {
    if (!faixa || typeof faixa !== "object") return null;
    const resultado = {};
    for (const campo of Object.keys(limites)) {
        if (faixa[campo] === null || faixa[campo] === undefined || faixa[campo] === "") return null;
        const numero = Number(faixa[campo]);
        if (!Number.isFinite(numero) || numero < minimoPossivel || numero > maximoPossivel) return null;
        resultado[campo] = numero;
    }
    if (!(resultado.atencaoMinima < resultado.atencaoMaxima)
        || !(resultado.criticaMinima < resultado.atencaoMinima)
        || !(resultado.criticaMaxima > resultado.atencaoMaxima)) return null;
    return resultado;
};

class DeviceSettingsController {
    async obter(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Dispositivo inválido." });
            const dispositivo = await Dispositivo.findOne({ _id: id, usuario: req.user._id });
            if (!dispositivo) return res.status(404).json({ message: "Dispositivo não encontrado." });

            return res.status(200).json({ configuracoes: dispositivo.configuracoes });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Dispositivo inválido." });

            const dispositivo = await Dispositivo.findOne({ _id: id, usuario: req.user._id });
            if (!dispositivo) return res.status(404).json({ message: "Dispositivo não encontrado." });

            const corpo = req.body || {};
            const nome = typeof corpo.nome === "string" ? corpo.nome.trim() : "";
            const umidade = lerFaixa(corpo.umidade, LIMITES_PADRAO.umidade, 0, 100);
            const temperatura = lerFaixa(corpo.temperatura, LIMITES_PADRAO.temperatura, -50, 100);
            const unidadeValida = ["C", "F"].includes(corpo.unidade);
            const periodoValido = ["day", "week", "month"].includes(corpo.periodoPadrao);

            if (!nome || nome.length > 40 || !umidade || !temperatura || !unidadeValida || !periodoValido) {
                return res.status(400).json({
                    message: "Confira o nome, os limites e as preferências. Os limites críticos devem ficar além dos limites de atenção."
                });
            }

            dispositivo.configuracoes = { nome, umidade, temperatura, unidade: corpo.unidade, periodoPadrao: corpo.periodoPadrao };
            await dispositivo.save();
            return res.status(200).json({
                message: "Configurações atualizadas com sucesso.",
                configuracoes: dispositivo.configuracoes
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }
}

module.exports = new DeviceSettingsController();
