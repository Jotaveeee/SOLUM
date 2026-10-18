const mongoose = require("mongoose");

// Preferências configuráveis e isoladas para cada protótipo.
const ConfiguracoesSchema = new mongoose.Schema({
    nome: { type: String, default: "" },
    umidade: {
        atencaoMinima: { type: Number, default: 40 },
        atencaoMaxima: { type: Number, default: 73 },
        criticaMinima: { type: Number, default: 20 },
        criticaMaxima: { type: Number, default: 80 }
    },
    temperatura: {
        atencaoMinima: { type: Number, default: 20 },
        atencaoMaxima: { type: Number, default: 30 },
        criticaMinima: { type: Number, default: 15 },
        criticaMaxima: { type: Number, default: 40 }
    },
    unidade: { type: String, enum: ["C", "F"], default: "C" },
    periodoPadrao: { type: String, enum: ["day", "week", "month"], default: "month" }
}, { _id: false });

const DispositivoSchema = new mongoose.Schema({

    deviceId: {
        type: String,
        required: true,
        unique: true
    },
    apiKey: {
        type: String,
        required: true,
        unique: true
    },
    fazenda: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fazenda",
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    },
    vinculado: {
        type: Boolean,
        default: false
    },
    ativo: {
        type: Boolean,
        default: true
    },

    ultimaConexao: {
        type: Date,
        default: null
    },
    versaoFirmware: {
        type: String,
        default: "1.0.0"
    },
    modelo: {
        type: String,
        default: "ESP32 Solo V1"
    },
    configuracoes: {
        type: ConfiguracoesSchema,
        default: () => ({})
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Dispositivo", DispositivoSchema);
