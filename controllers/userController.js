// controllers/userController.js

const { Router } = require('express');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

const router = Router();

// Handlers para renderização de páginas e funcionalidades
const handlers = {
    getRegisterPage: (req, res) => {
        res.render('user/register');
    },

    getLoginPage: (req, res) => {
        res.render('user/login');
    },

    getDashboard: (req, res) => {
        if (!req.session.user) {
            return res.redirect('/');
        }
        res.render('user/dashboard', { user: req.session.user });
    },
    
    // ✅ FUNÇÃO ADICIONADA: Página de edição (caso você crie uma view para isso)
    getEditPage: (req, res) => {
        if (!req.session.user) {
            return res.redirect('/');
        }
        res.render('user/edit', { user: req.session.user });
    },

    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/');
    },

    postRegister: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!password || password.length < 6) {
                return res.status(400).send('A senha deve ter pelo menos 6 caracteres.');
            }

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).send('Email já registrado.');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ name, email, password: hashedPassword });
            req.session.user = { id: user.id, name: user.name };
            res.redirect('/');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao registrar usuário.');
        }
    },

    postLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(400).send('Usuário não encontrado.');
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).send('Senha incorreta.');
            }
            req.session.user = { id: user.id, name: user.name };
            res.redirect('/user/dashboard');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao fazer login.');
        }
    },
    
    // ✅ LÓGICA ADICIONADA: Atualizar informações do usuário
    postEdit: async (req, res) => {
        if (!req.session.user) {
            return res.status(401).send('Acesso não autorizado.');
        }
        try {
            const { name, email, password, confirmPassword } = req.body;
            const user = await User.findByPk(req.session.user.id);

            if (!user) {
                return res.status(404).send('Usuário não encontrado.');
            }

            // Atualiza o nome e email
            user.name = name;
            user.email = email;

            // Se uma nova senha foi fornecida, atualiza a senha
            if (password) {
                if (password !== confirmPassword) {
                    return res.status(400).send('As senhas não coincidem.');
                }
                user.password = await bcrypt.hash(password, 10);
            }

            await user.save();
            req.session.user.name = user.name; // Atualiza o nome na sessão
            res.redirect('/user/dashboard');

        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao atualizar usuário.');
        }
    },

    // ✅ LÓGICA ADICIONADA: Deletar a conta do usuário
    postDelete: async (req, res) => {
        if (!req.session.user) {
            return res.status(401).send('Acesso não autorizado.');
        }
        try {
            await User.destroy({ where: { id: req.session.user.id } });
            req.session.destroy();
            res.redirect('/');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao deletar usuário.');
        }
    },
};

// --- Associação das rotas aos handlers ---
router.get('/register', handlers.getRegisterPage);
router.post('/register', handlers.postRegister);

router.get('/login', handlers.getLoginPage);
router.post('/login', handlers.postLogin);

router.get('/logout', handlers.logout);
router.get('/dashboard', handlers.getDashboard);

// ✅ ROTAS ADICIONADAS
router.get('/edit', handlers.getEditPage); // Rota para a página de edição
router.post('/edit', handlers.postEdit);    // Rota que recebe os dados de edição
router.post('/delete', handlers.postDelete);  // Rota para deletar o usuário

// Exporta o router para o app e os handlers para os testes
module.exports = router;
module.exports.handlers = handlers;
