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
    static async addChapter({ name, courseId }) {
      return await this.create({ name: name, courseId: courseId });
    }

    static async getChapters() {
      return await this.findAll();
    }
    static async getChapter(courseId) {
      return await this.findAll({
        where: {
          courseId: courseId,
        },
      })
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