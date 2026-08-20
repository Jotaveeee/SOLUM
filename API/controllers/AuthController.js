const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {

    gerarToken(id) {
        return jwt.sign(
            { id },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );
    }

    formatarUsuario(usuario) {
        return {
            id: usuario._id,
            nome: usuario.nome,
            Fazenda: usuario.Fazenda,
            email: usuario.email
        };
    }

    validarEmail(email) {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
    }

    async register(req, res) {
        try {

            const { nome, Fazenda, email, senha } = req.body;

            if (!nome || !email || !senha) {
                return res.status(400).json({
                    message: "Preencha todos os campos."
                });
            }

            if (!this.validarEmail(email)) {
                return res.status(400).json({
                    message: "E-mail inválido."
                });
            }

            const usuarioExistente = await Usuario.findOne({ email });

            if (usuarioExistente) {
                return res.status(409).json({
                    message: "Este e-mail já está cadastrado."
                });
            }

            const senhaHash = await bcrypt.hash(senha, 10);

            const usuario = await Usuario.create({
                nome,
                Fazenda,
                email,
                senha: senhaHash
            });

            const token = this.gerarToken(usuario._id);

            return res.status(201).json({
                message: "Usuário criado com sucesso.",
                token,
                usuario: this.formatarUsuario(usuario)
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: "Erro interno do servidor."
            });

        }
    }

    async login(req, res) {
        try {

            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({
                    message: "Informe o e-mail e a senha."
                });
            }

            if (!this.validarEmail(email)) {
                return res.status(400).json({
                    message: "E-mail inválido."
                });
            }

            const usuario = await Usuario.findOne({ email });

            if (!usuario) {
                return res.status(401).json({
                    message: "E-mail ou senha inválidos."
                });
            }

            const senhaValida = await bcrypt.compare(
                senha,
                usuario.senha
            );

            if (!senhaValida) {
                return res.status(401).json({
                    message: "E-mail ou senha inválidos."
                });
            }

            const token = this.gerarToken(usuario._id);

            return res.status(200).json({
                message: "Login realizado com sucesso.",
                token,
                usuario: this.formatarUsuario(usuario)
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: "Erro interno do servidor."
            });

        }
    }

    async me(req, res) {

        return res.status(200).json({
            usuario: this.formatarUsuario(req.user)
        });

    }

}

module.exports = new AuthController();