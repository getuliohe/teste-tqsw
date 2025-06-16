// models/Student.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    // Adicione esta seção para especificar o nome da tabela
    tableName: 'students',
    timestamps: true
});

module.exports = Student;
