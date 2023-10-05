'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CardTransfers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cityfrom: {
        type: Sequelize.STRING
      },
      cityto: {
        type: Sequelize.STRING
      },
      timefrom: {
        type: Sequelize.STRING
      },
      timeto: {
        type: Sequelize.STRING
      },
      walkfrom: {
        type: Sequelize.STRING
      },
      walkto: {
        type: Sequelize.STRING
      },
      cars: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CardTransfers');
  }
};