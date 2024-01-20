'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {

    static associate(models) {
      Course.belongsTo(models.Educator, {
        foreignKey: 'educatorId'
      });
      //Course.hasMany(models.Chapter);

    }

    static async addCourse({ name, description }) {
      return await this.create({ name, description });
    }

    static async getCourses() {
      return await this.findAll();
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