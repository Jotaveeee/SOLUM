const mongoose = require("mongoose");

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
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Dispositivo", DispositivoSchema);