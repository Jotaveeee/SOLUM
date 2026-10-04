const Fazenda = require("../models/Fazenda");
const mongoose = require("mongoose");
const Dispositivo = require("../models/Dispositivo");
const Leitura = require("../models/Leitura");

class FazendaController {

    formatarFazenda(fazenda) {
        return {
            id: fazenda._id,
            nome: fazenda.nome,
            usuario: fazenda.usuario,
            createdAt: fazenda.createdAt
        };
    }

    async me(req, res) {
    
        try {
    
            const fazendas = await Fazenda.find({
                usuario: req.user._id
            });
    
            if (fazendas.length === 0) {
    
                return res.status(404).json({
                    message: "Nenhuma fazenda encontrada."
                });
            }
    
            return res.status(200).json({
    
                fazendas: fazendas.map(
                    fazenda => this.formatarFazenda(fazenda)
                )
    
            });
    
        } catch (error) {
    
            console.error(error);
    
            return res.status(500).json({
                message: "Erro interno do servidor."
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: "Fazenda inválida." });
            }

            const fazenda = await Fazenda.findOne({ _id: id, usuario: req.user._id });

            if (!fazenda) {
                return res.status(404).json({ message: "Fazenda não encontrada." });
            }

            const dispositivos = await Dispositivo.find({
                fazenda: fazenda._id,
                usuario: req.user._id
            }).select("_id");

            const ids = dispositivos.map(d => d._id);

            // ordem: leituras → dispositivos → fazenda
            await Leitura.deleteMany({ dispositivo: { $in: ids } });
            await Dispositivo.deleteMany({ _id: { $in: ids } });
            await fazenda.deleteOne();

            return res.status(200).json({ message: "Fazenda removida com sucesso." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    async criar(req, res) {
        try {
            const nome = typeof req.body.nome === "string" ? req.body.nome.trim() : "";

            if (!nome) {
                return res.status(400).json({ message: "Informe o nome da fazenda." });
            }

            const fazenda = await Fazenda.create({ nome, usuario: req.user._id });

            return res.status(201).json({
                message: "Fazenda criada com sucesso.",
                fazenda: this.formatarFazenda(fazenda)
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }
}

module.exports = new FazendaController();