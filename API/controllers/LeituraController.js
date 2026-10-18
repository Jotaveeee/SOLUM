const Dispositivo = require("../models/Dispositivo");
const Leitura = require("../models/Leitura");
const AlertaController = require("./AlertaController");
const mongoose = require("mongoose");

const obterIntervalo = (query) => {
    const inicio = new Date(query.inicio);
    const fim = new Date(query.fim);
    if (!query.inicio || !query.fim || Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime()) || inicio > fim) {
        return null;
    }
    return { inicio, fim };
};

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

            try {
                await AlertaController.reconciliarResolvidosParaLeitura(dispositivo, leitura);
            } catch (error) {
                console.error("Erro ao atualizar alertas resolvidos:", error);
            }

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
            }).select("_id").lean();

            // Pega somente os IDs dos dispositivos
            const dispositivosIds = dispositivos.map(
                dispositivo => dispositivo._id
            );

            // Os cartões da lista precisam somente da leitura mais recente de cada sensor.
            const leituras = dispositivosIds.length
                ? await Leitura.aggregate([
                    { $match: { dispositivo: { $in: dispositivosIds } } },
                    { $sort: { createdAt: -1, _id: -1 } },
                    { $project: { dispositivo: 1, createdAt: 1, temperatura: 1, umidadeSolo: 1, bateria: 1 } },
                    { $group: { _id: "$dispositivo", leitura: { $first: "$$ROOT" } } },
                    { $replaceRoot: { newRoot: "$leitura" } }
                ])
                : [];

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

    async resumoDispositivo(req, res) {
        try {
            const { dispositivoId } = req.params;
            const { periodo, timezone = "UTC" } = req.query;
            const intervalo = obterIntervalo(req.query);

            if (!mongoose.Types.ObjectId.isValid(dispositivoId)) {
                return res.status(400).json({ message: "Sensor inválido." });
            }
            if (!intervalo || !["day", "week", "month"].includes(periodo)) {
                return res.status(400).json({ message: "Período inválido." });
            }
            try {
                new Intl.DateTimeFormat("pt-BR", { timeZone: timezone });
            } catch {
                return res.status(400).json({ message: "Fuso horário inválido." });
            }

            const dispositivo = await Dispositivo.findOne({ _id: dispositivoId, usuario: req.user._id }).select("_id").lean();
            if (!dispositivo) return res.status(404).json({ message: "Sensor não encontrado." });

            const unidade = periodo === "day" ? "hour" : "day";
            const [resultado, ultimaLeitura] = await Promise.all([
                Leitura.aggregate([
                    { $match: { dispositivo: dispositivo._id, createdAt: { $gte: intervalo.inicio, $lte: intervalo.fim } } },
                    { $facet: {
                        resumo: [{ $group: { _id: null, total: { $sum: 1 }, mediaUmidade: { $avg: "$umidadeSolo" }, mediaTemperatura: { $avg: "$temperatura" }, menorTemperatura: { $min: "$temperatura" }, maiorTemperatura: { $max: "$temperatura" } } }],
                        pontosGrafico: periodo === "day" ? [
                            { $sort: { createdAt: 1, _id: 1 } },
                            { $project: { _id: 0, timestamp: "$createdAt", umidade: "$umidadeSolo", temperatura: 1 } }
                        ] : [
                            { $group: { _id: { $dateTrunc: { date: "$createdAt", unit: unidade, timezone } }, umidade: { $avg: "$umidadeSolo" }, temperatura: { $avg: "$temperatura" }, quantidade: { $sum: 1 } } },
                            { $sort: { _id: 1 } },
                            { $project: { _id: 0, timestamp: "$_id", umidade: 1, temperatura: 1, quantidade: 1 } }
                        ]
                    } }
                ]),
                Leitura.findOne({ dispositivo: dispositivo._id }).sort({ createdAt: -1, _id: -1 }).lean()
            ]);

            const dados = resultado[0] || { resumo: [], pontosGrafico: [] };
            return res.status(200).json({
                resumo: dados.resumo[0] || { total: 0, mediaUmidade: null, mediaTemperatura: null, menorTemperatura: null, maiorTemperatura: null },
                pontosGrafico: dados.pontosGrafico,
                ultimaLeitura,
                unidadeGrafico: unidade
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    async historicoDispositivo(req, res) {
        try {
            const { dispositivoId } = req.params;
            const offset = Number(req.query.offset ?? 0);
            const limit = Math.min(10, Math.max(1, Number(req.query.limit ?? 10)));
            const intervalo = req.query.inicio || req.query.fim ? obterIntervalo(req.query) : null;

            if (!mongoose.Types.ObjectId.isValid(dispositivoId)) {
                return res.status(400).json({ message: "Sensor inválido." });
            }
            if ((req.query.inicio || req.query.fim) && !intervalo) {
                return res.status(400).json({ message: "Intervalo do histórico inválido." });
            }
            if (!Number.isInteger(offset) || offset < 0 || !Number.isInteger(limit)) {
                return res.status(400).json({ message: "Parâmetros do histórico inválidos." });
            }
            const dispositivo = await Dispositivo.findOne({ _id: dispositivoId, usuario: req.user._id }).select("_id").lean();
            if (!dispositivo) return res.status(404).json({ message: "Sensor não encontrado." });

            const filtro = {
                dispositivo: dispositivo._id,
                ...(intervalo ? { createdAt: { $gte: intervalo.inicio, $lte: intervalo.fim } } : {})
            };
            const [leituras, total] = await Promise.all([
                Leitura.find(filtro).sort({ createdAt: -1, _id: -1 }).skip(offset).limit(limit).select("createdAt temperatura umidadeSolo bateria").lean(),
                Leitura.countDocuments(filtro)
            ]);
            return res.status(200).json({ leituras, total, offset, limit });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }
}

module.exports = new LeituraController();
