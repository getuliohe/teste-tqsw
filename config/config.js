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
    password: process.env.DB_TEST_PASSWORD, // Lendo a senha do secret
    database: process.env.DB_TEST_DATABASE, // Lendo o nome do DB do secret
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false
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