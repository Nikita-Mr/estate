const { HotelModel, NumberModel } = require('../modules/models');

const testHotelCreation = async () => {
    let singleHotel = await HotelModel.findByPk(1, { include: ["NumberModel"] });
    let allHotels = await HotelModel.findAll({ include: ["NumberModel"] });

    console.log(singleHotel, allHotels);
}

module.exports = { testHotelCreation }
