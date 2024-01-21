'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Enrollments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Enrollments.belongsTo(models.Course, { foreignKey: 'courseId' });
      // define association here
    }
  }
  Enrollments.init({
    studentId: DataTypes.INTEGER,
    courseId: DataTypes.INTEGER,
    completionPercentage: {
      type: DataTypes.FLOAT, // You can use DECIMAL if you want to store exact values
      defaultValue: 0,
  },
    sequelize,
    modelName: 'Enrollments',
  });
  return Enrollments;
};