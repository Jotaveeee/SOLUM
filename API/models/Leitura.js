const mongoose = require("mongoose");

const LeituraSchema = new mongoose.Schema({

    dispositivo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dispositivo",
        required: true
    },

    temperatura: {
        type: Number,
        required: true
    },

    umidadeSolo: {
        type: Number,
        required: true
    },

    bateria: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }

}, {
    timestamps: true
});

LeituraSchema.index({ dispositivo: 1, createdAt: -1, _id: -1 });

module.exports = mongoose.model("Leitura", LeituraSchema);
