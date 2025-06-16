// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Adicione esta seção para especificar o nome da tabela
    tableName: 'users',
    timestamps: true // Recomendo manter, pois suas migrations criam os campos
});

module.exports = User;
