// models/Course.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    // Define a associação: um curso pode ter muitos estudantes
    static associate(models) {
      Course.hasMany(models.Student, {
        foreignKey: 'courseId',
        as: 'students'
      });
    }
  }
  Course.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Course',
    tableName: 'courses' // Manter a especificação do nome da tabela
  });
  return Course;
};
