'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {

    static associate(models) {
      //Chapter.belongsTo(models.Course);
      //Chapter.hasMany(models.Page)

    }
    static async addChapter({ name }) {
      return await this.create({ name: name });
    }

    static async getChapters() {
      return await this.findAll();
    }

  }
  Chapter.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Chapter',
  });
  return Chapter;
};