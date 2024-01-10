/*

    Формат броней: 
    {
        checkin: date,
        checkout: date,
        // телефон для связи
        phone: string
    }

*/

const { sequelize, HotelModel, NumberModel } = require('./models');

let bookingDebug = true;

// добавление номеров
const addNumber = async (
  hotel,
  name,
  adults,
  children,
  description,
  value,
  price,
  floor,
  lease_term,
  total_area,
  sleeping_rooms,
  sleeping_places,
  children_bed,
  double_places,
  single_spaces,
  additional_sleeping_places,
  bathrooms,
  bathrooms_showers,
  drying_for_inventory,
  wifi,
  warm_floor,
  dishwasher,
  parking_cars,
  mall,
  kazan,
  bath_territory,
  pool,
  transfer_city,
  transfer_mountain,
  live_whith_animals,
  additionally
) => {
  if (bookingDebug) console.log(hotel);
  //   let newNumber = await NumberModel.create({
  //     name: name,
  //     adults: adults,
  //     children: children,
  //     description: description,
  //     value: value,
  //     HotelModelId: hotel,
  //     bookings: {},
  //   });
  //   await newNumber.save();
  console.log([
    {
      price: price,
      name: name,
      bookings: {},
      HotelModelId: hotel, //ошибка тутутуутуутутуутуутуутутуутутуутутутууттуутутутууттт долбаебикс смотри сюда
      floor,
      lease_term,
      total_area,
      sleeping_rooms,
      sleeping_places,
      children_bed,
      double_places,
      single_spaces,
      additional_sleeping_places,
      bathrooms,
      bathrooms_showers,
      drying_for_inventory,
      wifi,
      warm_floor,
      dishwasher,
      parking_cars,
      mall,
      kazan,
      bath_territory,
      pool,
      transfer_city,
      transfer_mountain,
      live_whith_animals,
      additionally,
    },
  ]);
  const newNumber = await NumberModel.create({
    price: price,
    name: name,
    bookings: {},
    HotelModelId: hotel, //ошибка тутутуутуутутуутуутуутутуутутуутутутууттуутутутууттт долбаебикс смотри сюда
    floor,
    lease_term,
    total_area,
    sleeping_rooms,
    sleeping_places,
    children_bed,
    double_places,
    single_spaces,
    additional_sleeping_places,
    bathrooms,
    bathrooms_showers,
    drying_for_inventory,
    wifi,
    warm_floor,
    dishwasher,
    parking_cars,
    mall,
    kazan,
    bath_territory,
    pool,
    transfer_city,
    transfer_mountain,
    live_whith_animals,
    additionally,
  });
  await newNumber.save();

  if (bookingDebug) console.log('created number, will save now...');

  return '200';
};

// бронирование
const tryBook = async (number, checkin, checkout, phone) => {
  // Примечание: number - объект бд, так что с ним тут юзаются сейвы и всякое такое
  if (bookingDebug) console.log('number bookings is: ', number.bookings);

  // если есть уже забронированные номера тарифа
  if (Object.keys(number.bookings).length) {
    if (bookingDebug) console.log('number have some bookings already');

    number.bookings = [...number.bookings];

    let timeIn = new Date(checkin).getTime();
    let timeOut = new Date(checkout).getTime();

    let bookedAtChosenDate = 0;

    // number.bookings должна быть массивом из объектов брони.
    // считает, сколько номеров забронировано на данные даты
    number.bookings.forEach((booking) => {
      let bookingTimeIn = new Date(booking.checkin).getTime();
      let bookingTimeOut = new Date(booking.checkout).getTime();

      if (bookingDebug)
        console.log(
          'timeIn valid/timeOut valid: ',
          timeIn < bookingTimeIn,
          timeOut > bookingTimeOut
        );

      if (timeIn <= bookingTimeIn || timeOut >= bookingTimeOut)
        bookedAtChosenDate++;
    });
    if (bookingDebug)
      console.log('numbers booked already: ', bookedAtChosenDate);

    // выясняет, есть ли номера
    let canBook = bookedAtChosenDate < number.value;
    if (bookingDebug) console.log('canBook: ', canBook);
    if (!canBook) return canBook;

    //если номера есть, идет этот код
    number.bookings = [
      ...number.bookings,
      {
        checkin,
        checkout,
        phone,
      },
    ];
    if (bookingDebug) console.log('done, number bookings: ', number.bookings);
  } else
    number.bookings = [
      {
        checkin,
        checkout,
        phone,
      },
    ];
  if (bookingDebug) console.log('done, number bookings: ', number.bookings);

  await number.save();
  if (bookingDebug) console.log('number saved');
  return { status: 200, message: 'Вы забронировались', success: true };
  return true;
};

module.exports = { addNumber, tryBook };
