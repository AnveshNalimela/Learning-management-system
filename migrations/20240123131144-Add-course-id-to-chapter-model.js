'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Chapters', 'courseId', {
      type: Sequelize.DataTypes.INTEGER,

    })
    await queryInterface.addConstraint('Chapters', {
      fields: ['courseId'],
      type: 'foreign key',
      references: {
        table: 'Chapters',
        field: 'id'
      }

    })

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Chapter', 'courseId')

  }
};
