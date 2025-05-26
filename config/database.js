const { Sequelize } = require('sequelize');
require('dotenv').config();
const config = require('./config.json')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false // Desativa logs SQL no console
  }
);

// Teste de conexão
sequelize.authenticate()
  .then(() => console.log('✅ Conexão com DB estabelecida'))
  .catch(err => console.error('❌ Falha na conexão:', err));

module.exports = sequelize;

module.exports = sequelize;
