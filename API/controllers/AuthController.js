const Usuario = require("../models/Usuario");
const Fazenda = require("../models/Fazenda");
const Dispositivo = require("../models/Dispositivo");
const Leitura = require("../models/Leitura");
const AlertaResolvido = require("../models/AlertaResolvido");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {

    constructor() {
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.me = this.me.bind(this);
        this.updateMe = this.updateMe.bind(this);
        this.deleteMe = this.deleteMe.bind(this);
    }

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
            email: usuario.email
        };
    }

    validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
}

    async register(req, res) {

        try {

            const { nome, email, senha } = req.body;

            // Verifica campos obrigatórios
            if (!nome || !email || !senha) {
                return res.status(400).json({
                    message: "Preencha todos os campos."
                });
            }

            // Não permite espaços no e-mail
            if (/\s/.test(email)) {
                return res.status(400).json({
                    message: "O e-mail não pode conter espaços."
                });
            }

            // Valida formato do e-mail
            if (!this.validarEmail(email)) {
                return res.status(400).json({
                    message: "E-mail inválido."
                });
            }

            // Não permite espaços na senha
            if (/\s/.test(senha)) {
                return res.status(400).json({
                    message: "A senha não pode conter espaços."
                });
            }

            // Senha com no mínimo 8 caracteres
            if (senha.length < 8) {
                return res.status(400).json({
                    message: "A senha deve ter no mínimo 8 caracteres."
                });
            }

            // Verifica se o e-mail já existe
            const usuarioExistente = await Usuario.findOne({
                email
            });

            if (usuarioExistente) {
                return res.status(409).json({
                    message: "Este e-mail já está cadastrado."
                });
            }

            // Criptografa a senha
            const senhaHash = await bcrypt.hash(senha, 10);

            // Cria o usuário
            const usuario = await Usuario.create({
                nome,
                email,
                senha: senhaHash
            });

            // Gera token
            const token = this.gerarToken(usuario._id);

            return res.status(201).json({
                message: "Usuário criado com sucesso.",
                token,
                usuario: this.formatarUsuario(usuario)
            });

        } catch (error) {

            console.error("Erro no cadastro:", error);

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

            // Não permite espaços no e-mail
            if (/\s/.test(email)) {
                return res.status(400).json({
                    message: "O e-mail não pode conter espaços."
                });
            }

            if (!this.validarEmail(email)) {
                return res.status(400).json({
                    message: "E-mail inválido."
                });
            }

            // Não permite espaços na senha
            if (/\s/.test(senha)) {
                return res.status(400).json({
                    message: "A senha não pode conter espaços."
                });
            }

            const usuario = await Usuario.findOne({
                email
            });

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

            console.error("Erro no login:", error);

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

    async updateMe(req, res) {
        try {
            const nome = typeof req.body.nome === "string" ? req.body.nome.trim() : "";

            if (!nome) {
                return res.status(400).json({
                    message: "Informe um nome válido."
                });
            }

            if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nome)) {
                return res.status(400).json({
                    message: "O nome pode conter apenas letras e espaços."
                });
            }

            if (nome.length > 20) {
                return res.status(400).json({
                    message: "O nome deve ter no máximo 20 caracteres."
                });
            }

            req.user.nome = nome;
            await req.user.save();

            return res.status(200).json({
                message: "Nome atualizado com sucesso.",
                usuario: this.formatarUsuario(req.user)
            });
        } catch (error) {
            console.error("Erro ao atualizar nome do usuário:", error);

            return res.status(500).json({
                message: "Erro interno do servidor."
            });
        }
    }

    async deleteMe(req, res) {
        let session;

        try {
            session = await mongoose.startSession();
            const usuarioId = req.user._id;

            await session.withTransaction(async () => {
                const fazendas = await Fazenda.find({ usuario: usuarioId })
                    .select("_id")
                    .session(session)
                    .lean();
                const fazendaIds = fazendas.map((fazenda) => fazenda._id);
                const filtroDispositivos = fazendaIds.length
                    ? { $or: [{ usuario: usuarioId }, { fazenda: { $in: fazendaIds } }] }
                    : { usuario: usuarioId };
                const dispositivos = await Dispositivo.find(filtroDispositivos)
                    .select("_id")
                    .session(session)
                    .lean();
                const dispositivoIds = dispositivos.map((dispositivo) => dispositivo._id);

                if (dispositivoIds.length) {
                    await Leitura.deleteMany(
                        { dispositivo: { $in: dispositivoIds } },
                        { session }
                    );
                    await Dispositivo.deleteMany(
                        { _id: { $in: dispositivoIds } },
                        { session }
                    );
                }

                await AlertaResolvido.deleteMany(
                    dispositivoIds.length
                        ? { $or: [{ usuario: usuarioId }, { dispositivo: { $in: dispositivoIds } }] }
                        : { usuario: usuarioId },
                    { session }
                );
                await Fazenda.deleteMany({ usuario: usuarioId }, { session });
                await Usuario.deleteOne({ _id: usuarioId }, { session });
            });

            return res.status(200).json({ message: "Conta e dados associados excluídos com sucesso." });
        } catch (error) {
            console.error("Erro ao excluir conta:", error);
            return res.status(500).json({ message: "Não foi possível excluir a conta. Nenhum dado foi removido." });
        } finally {
            if (session) await session.endSession();
        }
    }
}

module.exports = new AuthController();
