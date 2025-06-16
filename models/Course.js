// models/Course.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    // Adicione esta seção para especificar o nome da tabela
    tableName: 'courses',
    timestamps: true
});

module.exports = Course;
