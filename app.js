const express = require('express');
const session = require('express-session');
const sequelize = require('./config/database');  
const Course = require('./models/Course'); 
//const {user, student, course} = require('./controllers');
const dotenv = require('dotenv');
const router = express.Router();     

// Novas linhas para o app.js

// Importa cada controller diretamente
const userController = require('./controllers/userController');
const studentController = require('./controllers/studentController');
const courseController = require('./controllers/courseController');

// ... (resto do seu código do app.js)

// Usa as variáveis dos controllers importados
app.use('/user', userController);
app.use('/student', studentController);
app.use('/courses', courseController);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: "process.env.SECRET",
    resave: false,
    saveUninitialized: false,
}));

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


async function syncDatabase() {
    try {
      if (process.env.NODE_ENV !== 'test') {
        try {
          await sequelize.sync({ alter: true });
          console.log('Comandos ALTER TABLE executados com sucesso');
        } catch (error) {
          console.error('Erro ao sincronizar o banco de dados ou executar ALTER TABLE:', error);
        }
      }
      // Sincroniza o banco de dados
      await sequelize.sync({ alter: true });
      console.log('Banco de dados sincronizado');
  
      // Executa os comandos ALTER TABLE
      await sequelize.query(`
        ALTER TABLE students
        MODIFY COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      
      await sequelize.query(`
        ALTER TABLE students
        MODIFY COLUMN updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      `);
  
      console.log('Comandos ALTER TABLE executados com sucesso');
    } catch (error) {
      console.error('Erro ao sincronizar o banco de dados ou executar ALTER TABLE:', error);
    }
}
  
//syncDatabase();

// Remova a seção app.listen e apenas exporte o app
module.exports = app; 
