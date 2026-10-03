const Fazenda = require("../models/Fazenda");

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
}

module.exports = new FazendaController();