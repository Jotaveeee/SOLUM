const mongoose = require("mongoose");

const FazendaSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: true
    },

    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Fazenda", FazendaSchema);
