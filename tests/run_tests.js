const { testHotelCreation } = require('./testHotelCreation');
const { testBooking } = require('./testBooking');

const run = async () => {
    console.log('INFO: running hotel creation...');
    await testHotelCreation();
    
    console.log('INFO: running booking...');
    await testBooking();
}

run();
