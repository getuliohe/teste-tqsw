'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Altere o nome da tabela para minúsculas
    await queryInterface.createTable('students', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          // O nome da tabela de referência também deve ser minúsculo
          model: 'courses', 
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Altere aqui também
    await queryInterface.dropTable('students');
  },
};
