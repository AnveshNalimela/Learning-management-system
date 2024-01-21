'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static async changePassword(studentId, hashedPwd) {

      const updatedStudent = await this.findByPk(studentId)
      updatedStudent.password = hashedPwd
      await updatedStudent.save();
      return updatedStudent;
    }
  }
  Student.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Student',
  });
  return Student;
};