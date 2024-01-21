'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Educator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Educator.hasMany(models.Course, {
        foreignKey: 'educatorId',

      })
    };

    static async addEducator({ name, email, password, role }) {
      return await this.create({ name, email, password, role });
    }
    static async changePassword(educatorId, hashedPwd) {
      
        const updatedEducator = await this.findByPk(educatorId)
        updatedEducator.password=hashedPwd
        await updatedEducator.save();
        return updatedEducator;
    }
          


  }
  Educator.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Educator',
  });
  return Educator;
};