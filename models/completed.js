'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Completed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Completed.init({
    userId: DataTypes.INTEGER,
    courseId: DataTypes.INTEGER,
    chapterId: DataTypes.INTEGER,
    pageId: DataTypes.INTEGER,
    enrollmentId: DataTypes.INTEGER,
    pageName: DataTypes.STRING,
    chapterName: DataTypes.STRING,
    courseName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Completed',
  });
  return Completed;
};