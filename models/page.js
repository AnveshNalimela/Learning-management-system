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
    static async addPage({ name }) {
      return await this.create({ name });
    }
  }
  Page.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Page',
  });
  return Page;
};