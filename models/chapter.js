'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {

    static associate(models) {
      Chapter.belongsTo(models.Course, {
        foreignKey: 'courseId'
      });
      Chapter.hasMany(models.Page, {
        foreignKey: 'chapterId'
      })
    }
  }
  Chapter.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Chapter',
  });
  return Chapter;
};