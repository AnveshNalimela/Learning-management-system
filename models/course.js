'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {

    static associate(models) {
      //Course.belongsTo(models.Educator);
      //Course.hasMany(models.Chapter);

    }

    static async addCourse({ name, description }) {
      return await this.create({ name, description });
    }
  }
  Course.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};