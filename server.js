// server.js
const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Sincroniza o banco de dados APENAS ao iniciar o servidor
    if (process.env.NODE_ENV !== 'test') {
      await sequelize.sync({ alter: true });
      console.log('Banco de dados sincronizado com sucesso.');
    }

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
  }
}

startServer();
