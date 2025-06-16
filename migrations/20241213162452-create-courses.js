'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Altere o nome da tabela para minúsculas
    await queryInterface.createTable('courses', {
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
      description: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('courses');
  },
};
