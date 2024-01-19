'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      chapter.belongsTo(models.course);
      chapter.hasMany(models.page)
    }
  }
  Chapter.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Chapter',
  });
  return Chapter;
};