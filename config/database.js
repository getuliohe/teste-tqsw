// Em config/database.js
const { Sequelize } = require('sequelize');
const config = require('./config.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

sequelize.authenticate()
  .then(() => console.log('✅ Conexão com DB estabelecida'))
  .catch(err => console.error('❌ Falha na conexão:', err));

module.exports = sequelize;