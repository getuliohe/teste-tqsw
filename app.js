// app.js

// 1. Importações primeiro
const express = require('express');
const session = require('express-session');
const sequelize = require('./config/database');
const dotenv = require('dotenv');

// Importa cada controller diretamente
const userController = require('./controllers/userController');
const studentController = require('./controllers/studentController');
const courseController = require('./controllers/courseController');

dotenv.config();

// 2. INICIALIZE O APP LOGO DEPOIS
const app = express();

// 3. Configure os middlewares
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: "process.env.SECRET",
    resave: false,
    saveUninitialized: false,
}));

// 4. Defina as rotas
app.get('/', async (req, res) => {
    res.render('user/login');
});

app.get('/register', (req, res) => {
    res.render('user/register');
});

app.get('/students/add', async (req, res) => {
    try {
      const courses = await sequelize.query('SELECT * FROM courses', {
        type: sequelize.QueryTypes.SELECT
      });
  
      res.render('students/add', { courses: courses });
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao carregar cursos.');
    }
});

// Usa as variáveis dos controllers importados
app.use('/user', userController);
app.use('/student', studentController);
app.use('/courses', courseController);

// 5. Exporte o app no final
module.exports = app;
