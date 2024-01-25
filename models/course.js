'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {

    static associate(models) {
      Course.hasMany(models.Chapter, {
        foreignKey: 'courseId'
      });
    }
  }
  Course.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    created: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};