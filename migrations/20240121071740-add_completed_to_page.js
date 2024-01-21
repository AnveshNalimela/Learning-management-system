'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Pages', 'completed', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.removeColumn('Pages', 'content');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Pages', 'completed');

  }
};
