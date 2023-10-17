const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('./models');

let bookingDebug = true;


// добавление номеров
const addNumber = (name, adults, children, description) => {
    
}


// бронирование
const canBook = (checkin, checkout, number) => {
    let timeIn = new Date(checkin).getTime();
    let timeOut = new Date(checkout).getTime(); 
    
    let booking.timeIn = new Date(booking.checkin).getTime();
    let booking.timeOut = new Date(booking.checkout).getTime();
    
    let bookedAtChosenDate = 0;
    
    let bookingAvailable = true;
    
    // number.books должна быть массивом из объектов брони.
    // считает, сколько номеров забронировано на данные даты
    number.books.forEach(booking => {
        if((timeIn < booking.timeOut) || (timeOut > booking.timeIn)) 
            bookedAtChosenDate++;
    });
    // если есть номера, ретурнит тру
    return (bookedAtChosenDate <= number.value) ? true : false;
}


