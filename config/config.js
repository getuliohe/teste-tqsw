// Em config/config.js
require('dotenv').config(); // Para ler variáveis de ambiente locais

module.exports = {
  development: {
    username: "root",
    password: "123456",
    database: "student_manager",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  test: {
      username: "root",
      password: process.env.DB_TEST_PASSWORD,
      database: process.env.DB_TEST_DATABASE,
      host: "127.0.0.1",
      dialect: "mysql",
      logging: false,
      // Adicione estas duas linhas:
      charset: 'utf8',
      collate: 'utf8_general_ci'
    },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};