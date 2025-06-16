// controllers/userController.js

const { Router } = require('express');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const router = Router();

// Exporte os manipuladores para que possam ser testados
const handlers = {
    getRegisterPage: (req, res) => {
        res.render('user/register');
    },

    getLoginPage: (req, res) => {
        res.render('user/login');
    },

    logout: (req, res) => {
        console.log('Logout efetuado');
        req.session.destroy();
        res.redirect('/');
    },

    getDashboard: (req, res) => {
        if (!req.session.user) {
            return res.redirect('/');
        }
        res.render('user/dashboard', { user: req.session.user });
    },

    postRegister: async (req, res) => {
        try {
            const { name, email, password } = req.body;
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
    
    // Inclua os outros handlers aqui (getEdit, postEdit, postDelete)...
};

// Associe os handlers às rotas
router.get('/register', handlers.getRegisterPage);
router.get('/login', handlers.getLoginPage);
router.get('/logout', handlers.logout);
router.get('/dashboard', handlers.getDashboard);
router.post('/register', handlers.postRegister);
router.post('/login', handlers.postLogin);
// ...

// Exporte o router para o app e os handlers para os testes
module.exports = router;
module.exports.handlers = handlers;
