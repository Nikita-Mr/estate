'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('UserModels', [
      {
        username: 'Никита',
        surname: 'Лысенков',
        email: 'example@example.com',
        phone: 79042065393,
        password: 'членовещание',
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
