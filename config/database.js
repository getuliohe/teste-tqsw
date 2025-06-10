// Em config/database.js

const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Verifica se o ambiente é de teste
if (process.env.NODE_ENV === 'test') {
  // Configuração para o ambiente de teste do GitHub Actions
  sequelize = new Sequelize(
    process.env.DB_TEST_DATABASE,
    'root', // O usuário é 'root' no serviço do Actions
    process.env.DB_TEST_PASSWORD,
    {
      host: '127.0.0.1', // O host é sempre 127.0.0.1 para serviços no Actions
      dialect: 'mysql',
      logging: false
    }
  );
} else {
  // Configuração para ambientes de desenvolvimento e produção (como estava antes)
  const config = require('./config.json')[process.env.NODE_ENV || 'development'];
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      dialect: config.dialect,
      logging: false
    }
  );
}

// Teste de conexão
sequelize.authenticate()
  .then(() => console.log('✅ Conexão com DB estabelecida'))
  .catch(err => console.error('❌ Falha na conexão:', err));

module.exports = sequelize;