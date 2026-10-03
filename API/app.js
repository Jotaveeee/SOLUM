require("dotenv").config();

const express = require("express");
const passport = require("passport");

const authRoutes = require("./routes/auth");
const deviceRoutes = require("./routes/devices");
const leituraRoutes = require("./routes/leituras");
const fazendaRoutes = require("./routes/fazendas");

const app = express();

// Passport
require("./config/passport");

// Middlewares
app.use(express.json());

app.use(passport.initialize());

//Rotas
app.get('/healthz', (req, res) => {
    res.status(200).json({
        status: "API funcionando"
    });
});

app.use("/auth", authRoutes);

app.use("/devices", deviceRoutes);

app.use("/leituras", leituraRoutes);

app.use("/fazenda", fazendaRoutes);
    
module.exports = app;