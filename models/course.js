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
      Course.hasMany(models.Chapter, {
        foreignKey: 'courseId'
      });

    }

    static async addCourse({ name, description, educatorId }) {
      return await this.create({ name, description, educatorId });
    }

    static async getCourses() {
      return await this.findAll();
    }
    static async getCourse(id) {
      return await this.findByPk(id);
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