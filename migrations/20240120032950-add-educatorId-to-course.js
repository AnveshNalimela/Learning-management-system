'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Courses', 'educatorId', {
      type: Sequelize.DataTypes.INTEGER,

    })
    await queryInterface.addConstraint('Courses', {
      fields: ['educatorId'],
      type: 'foreign key',
      references: {
        table: 'Courses',
        field: 'id'
      }

    })

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Courses', 'educatorId')

  }
};
