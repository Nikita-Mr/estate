'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('CardModels', [
      {
        category: "habitation",
        // subcategory: "hotel",// создать subcategory
        title: "Что то",
        img: "ol.jpg",
        p: "Prototip",
        price: 1000,
        phone: 79042065393,
        address: "Хуй внегородсикй",
        nameCard: "Если честно хз",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('CardModels', null, {});
  },
};
