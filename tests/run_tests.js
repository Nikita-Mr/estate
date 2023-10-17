const { testHotelCreation } = require('./testHotelCreation');

const run = async () => {
    console.log('INFO: running hotel creation...');
    await testHotelCreation();
}

run();
