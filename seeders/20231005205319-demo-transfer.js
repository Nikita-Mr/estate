module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('CardTransfers', [
      {
        cityfrom: 'John',
        cityto: 'Doe',
        timefrom: 'example@example.com',
        timeto: `12`,
        walkfrom: `1`,
        walkto: `3`,
        cars: `cars`,
        price: '1200',

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
