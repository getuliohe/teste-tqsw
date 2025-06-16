// models/Student.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    // Define a associação: um estudante pertence a um curso
    static associate(models) {
      Student.belongsTo(models.Course, {
        foreignKey: 'courseId',
        as: 'course'
      });
    }
  }
  Student.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    courseId: { // Certifique-se que a chave estrangeira existe
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'courses',
            key: 'id'
        }
    }
  }, {
    sequelize,
    modelName: 'Student',
    tableName: 'students' // Manter a especificação do nome da tabela
  });
  return Student;
};
