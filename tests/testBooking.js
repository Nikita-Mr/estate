const { HotelModel, NumberModel } = require('../modules/models');
const Booking = require('../modules/booking');

const testBooking = async () => {
    let singleHotel = await HotelModel.findByPk(1, { include: ["NumberModel"] });
    let gottaBook = singleHotel.NumberModel[0];
    
    const checkin = new Date('2023-10-18');
    const checkout = new Date('2023-10-25');
    
    const phone = 'phone';
    
    await Booking.tryBook(gottaBook, checkin, checkout, phone);
}

module.exports = { testBooking };