'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Page extends Model {

    static associate(models) {
      Page.belongsTo(models.Chapter, {
        foreignKey: 'chapterId'
      });
    }
  }
  Page.init({
    name: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Page',
  });
  return Page;
};