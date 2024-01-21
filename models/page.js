'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Page extends Model {

    static associate(models) {
      Page.belongsTo(models.Chapter, {
        foreignKey: 'chapterId'
      });

    }
    static async addPage({ name, chapterId }) {
      return await this.create({ name, chapterId });
    }

    static async setCompleted(id) {
      const page = await this.findByPk(id);
      page.completed = true;
      await page.save();
      return page;
    }

  }
  Page.init({
    name: DataTypes.STRING,
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false // Default value is set to false
    }
  }, {
    sequelize,
    modelName: 'Page',
  });
  return Page;
};