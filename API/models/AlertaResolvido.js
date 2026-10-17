const mongoose = require("mongoose");

const AlertaResolvidoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    dispositivo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dispositivo",
        required: true
    },
    fingerprint: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

AlertaResolvidoSchema.index(
    { usuario: 1, dispositivo: 1, fingerprint: 1 },
    { unique: true }
);

module.exports = mongoose.model("AlertaResolvido", AlertaResolvidoSchema);
