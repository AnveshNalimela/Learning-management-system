'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Pages', 'chapterId', {
      type: Sequelize.DataTypes.INTEGER,

    })
    await queryInterface.addConstraint('Pages', {
      fields: ['chapterId'],
      type: 'foreign key',
      references: {
        table: 'Pages',
        field: 'id'
      }

    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Pages', 'chapterId')
  }
};
