const mongoose = require("mongoose");
const AlertaResolvido = require("../models/AlertaResolvido");
const Dispositivo = require("../models/Dispositivo");
const Leitura = require("../models/Leitura");

const UMIDADE_CRITICA = 20;
const UMIDADE_ATENCAO_MINIMA = 40;
const UMIDADE_ATENCAO_MAXIMA = 73;
const UMIDADE_CRITICA_MAXIMA = 80;
const TEMPERATURA_CRITICA = 40;
const TEMPERATURA_ATENCAO_MINIMA = 20;
const TEMPERATURA_ATENCAO_MAXIMA = 30;

const avaliarIndicador = (campo, valor) => {
    if (!Number.isFinite(valor)) return null;

    if (campo === "umidadeSolo") {
        if (valor < UMIDADE_CRITICA) {
            return {
                severidade: "critical",
                campo,
                condicao: "abaixo-critico",
                nome: "Umidade do solo",
                valor,
                unidade: "%"
            };
        }
        if (valor < UMIDADE_ATENCAO_MINIMA) {
            return {
                severidade: "warning",
                campo,
                condicao: "abaixo-ideal",
                nome: "Umidade do solo",
                valor,
                unidade: "%"
            };
        }
        if (valor > UMIDADE_CRITICA_MAXIMA) {
            return {
                severidade: "critical",
                campo,
                condicao: "acima-critico",
                nome: "Umidade do solo",
                valor,
                unidade: "%"
            };
        }
        if (valor > UMIDADE_ATENCAO_MAXIMA) {
            return {
                severidade: "warning",
                campo,
                condicao: "acima-ideal",
                nome: "Umidade do solo",
                valor,
                unidade: "%"
            };
        }
        return null;
    }

    if (campo === "temperatura") {
        if (valor >= TEMPERATURA_CRITICA) {
            return {
                severidade: "critical",
                campo,
                condicao: "acima-critico",
                nome: "Temperatura",
                valor,
                unidade: "°C"
            };
        }
        if (valor < TEMPERATURA_ATENCAO_MINIMA) {
            return {
                severidade: "warning",
                campo,
                condicao: "abaixo-ideal",
                nome: "Temperatura",
                valor,
                unidade: "°C"
            };
        }
        if (valor > TEMPERATURA_ATENCAO_MAXIMA) {
            return {
                severidade: "warning",
                campo,
                condicao: "acima-ideal",
                nome: "Temperatura",
                valor,
                unidade: "°C"
            };
        }
    }

    return null;
};

const agruparAlertas = (dispositivos, leituras) => {
    const leituraMaisRecente = new Map();

    leituras.forEach((leitura) => {
        const dispositivoId = String(leitura.dispositivo);
        const atual = leituraMaisRecente.get(dispositivoId);
        if (!atual || leitura.createdAt > atual.createdAt) {
            leituraMaisRecente.set(dispositivoId, leitura);
        }
    });

    const alertas = [];

    dispositivos.forEach((dispositivo) => {
        const leitura = leituraMaisRecente.get(String(dispositivo._id));
        if (!leitura) return;

        const indicadores = [
            avaliarIndicador("umidadeSolo", Number(leitura.umidadeSolo)),
            avaliarIndicador("temperatura", Number(leitura.temperatura))
        ].filter(Boolean);
        const grupos = new Map();

        indicadores.forEach((indicador) => {
            const grupo = grupos.get(indicador.severidade) || [];
            grupo.push(indicador);
            grupos.set(indicador.severidade, grupo);
        });

        grupos.forEach((metricas, severidade) => {
            const condicoesOrdenadas = metricas
                .map((metrica) => `${metrica.campo}:${metrica.condicao}`)
                .sort();
            const fingerprint = `${severidade}:${condicoesOrdenadas.join("+")}`;
            const nomes = metricas.map((metrica) => metrica.nome);
            const somenteTemperatura = metricas.length === 1 && metricas[0].campo === "temperatura";
            const somenteUmidade = metricas.length === 1 && metricas[0].campo === "umidadeSolo";
            const unicaMetrica = metricas[0];

            alertas.push({
                id: `${dispositivo._id}:${fingerprint}`,
                fingerprint,
                dispositivoId: String(dispositivo._id),
                dispositivoNome: dispositivo.deviceId || "Sensor",
                fazendaNome: dispositivo.fazenda?.nome || "Fazenda sem nome",
                horario: leitura.createdAt,
                tipo: severidade,
                titulo: nomes.length > 1
                    ? `Múltiplos indicadores em nível ${severidade === "critical" ? "crítico" : "de atenção"}`
                    : somenteTemperatura
                        ? `Temperatura ${severidade === "critical" ? "crítica" : unicaMetrica.condicao === "abaixo-ideal" ? "baixa" : "elevada"}`
                        : somenteUmidade
                            ? `Umidade do solo ${severidade === "critical" ? "crítica" : unicaMetrica.condicao === "acima-ideal" ? "alta" : "baixa"}`
                            : "Alerta do sensor",
                descricao: metricas
                    .map((metrica) => `${metrica.nome} ${metrica.condicao.startsWith("abaixo") ? "baixa" : "alta"}: ${metrica.valor}${metrica.unidade}`)
                    .join(" · "),
                icone: nomes.length > 1
                    ? "warning-outline"
                    : metricas[0].campo === "temperatura" ? "thermometer-outline" : "water-outline",
                metricas
            });
        });
    });

    return alertas.sort((a, b) => (a.tipo === b.tipo ? 0 : a.tipo === "critical" ? -1 : 1));
};

class AlertaController {
    async reconciliarResolvidosParaLeitura(dispositivo, leitura) {
        if (!dispositivo.usuario) return;

        const fingerprintsAtivos = agruparAlertas([dispositivo], [leitura])
            .map((alerta) => alerta.fingerprint);
        const filtro = {
            usuario: dispositivo.usuario,
            dispositivo: dispositivo._id
        };

        if (fingerprintsAtivos.length) {
            filtro.fingerprint = { $nin: fingerprintsAtivos };
        }

        await AlertaResolvido.deleteMany(filtro);
    }

    async me(req, res) {
        try {
            const usuarioId = req.user._id;
            const dispositivos = await Dispositivo.find({
                usuario: usuarioId,
                ativo: true
            }).select("deviceId fazenda").populate("fazenda", "nome").lean();
            const dispositivoIds = dispositivos.map((dispositivo) => dispositivo._id);
            const leituras = dispositivoIds.length
                ? await Leitura.aggregate([
                    { $match: { dispositivo: { $in: dispositivoIds } } },
                    { $sort: { dispositivo: 1, createdAt: -1, _id: -1 } },
                    { $project: { dispositivo: 1, createdAt: 1, temperatura: 1, umidadeSolo: 1 } },
                    { $group: { _id: "$dispositivo", leitura: { $first: "$$ROOT" } } },
                    { $replaceRoot: { newRoot: "$leitura" } }
                ])
                : [];
            const alertasAtivos = agruparAlertas(dispositivos, leituras);
            const fingerprintsAtivos = new Set(
                alertasAtivos.map((alerta) => `${alerta.dispositivoId}:${alerta.fingerprint}`)
            );

            const resolvidos = dispositivoIds.length
                ? await AlertaResolvido.find({ usuario: usuarioId, dispositivo: { $in: dispositivoIds } })
                    .select("_id dispositivo fingerprint").lean()
                : [];
            const resolvidosObsoletos = resolvidos
                .filter((registro) => !fingerprintsAtivos.has(`${registro.dispositivo}:${registro.fingerprint}`))
                .map((registro) => registro._id);

            if (resolvidosObsoletos.length) {
                await AlertaResolvido.deleteMany({ _id: { $in: resolvidosObsoletos } });
            }

            const resolvidosAtivos = new Set(
                resolvidos
                    .filter((registro) => fingerprintsAtivos.has(`${registro.dispositivo}:${registro.fingerprint}`))
                    .map((registro) => `${registro.dispositivo}:${registro.fingerprint}`)
            );

            return res.status(200).json({
                alertas: alertasAtivos.filter(
                    (alerta) => !resolvidosAtivos.has(`${alerta.dispositivoId}:${alerta.fingerprint}`)
                )
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    async resolver(req, res) {
        try {
            const { dispositivoId, fingerprint } = req.body;

            if (!mongoose.isValidObjectId(dispositivoId) || typeof fingerprint !== "string" || !fingerprint.trim()) {
                return res.status(400).json({ message: "Alerta inválido." });
            }

            const dispositivo = await Dispositivo.findOne({
                _id: dispositivoId,
                usuario: req.user._id
            }).select("_id");

            if (!dispositivo) {
                return res.status(404).json({ message: "Sensor não encontrado." });
            }

            await AlertaResolvido.updateOne(
                {
                    usuario: req.user._id,
                    dispositivo: dispositivo._id,
                    fingerprint
                },
                {
                    $setOnInsert: {
                        usuario: req.user._id,
                        dispositivo: dispositivo._id,
                        fingerprint
                    }
                },
                { upsert: true }
            );

            return res.status(200).json({ message: "Alerta marcado como resolvido." });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(200).json({ message: "Alerta marcado como resolvido." });
            }
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }
}

module.exports = new AlertaController();
