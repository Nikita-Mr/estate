let { sequelize, NewsModel, UserModel, CardModel, HotelModel, NumberModel } = require('./modules/models');


const THE_FUCKING_CURE = async () => 
{

    await sequelize.drop();
    console.log('tables dropped, creating new ones...');

    await sequelize.sync({
        force: true
    });
    console.log('tables synchronized.');

    const newCard = await CardModel.create({
        category: "habitation",
        subcategory: 'hotel',
        title: "Test",
        img: {},
        p: "Prototip",
        price: 1000,
        phone: "+79042065393",
        address: "ул Пушкина",
        email: 'zankov.vadik@yandex.ru',
        nameCard: "simple",
        verified: false
    });

    console.log('created card...');

    const newUser = await UserModel.create({
        username: 'Admin',
        surname: 'Adminov',
        email: 'example@example.com',
        phone: '+79042065393',
        password: 'admin123',
        role: "ADMIN"
    }, );
    
    const otherUser = await UserModel.create({
        username: 'name',
        surname: 'surname',
        email: 'name@mail.ru',
        phone: 'phone',
        password: 'password',
        role: "ADMIN"
    }, );

    console.log('created user...');

    const newNew = await NewsModel.create({
        title: 'example new',
        content: 'some content'
    }, );

    console.log('created new...');
    
    const newHotel = await HotelModel.create({
        category:       'uhuh what',
        subcategory:    'uhuh what',
        title:          'uhuh what',
        img:            { },
        p:              'uhuh what',
        phone:          'uhuh what',
        address:        'uhuh what',
        email:          'zankov.vadik@yandex.ru',
        verified:        false
    }, );
    
    const newNumber = await NumberModel.create({
        name:           'uhuh what',
        adults:         0,
        children:       0,
        description:    'uhuh what',
        bookings:       {},
        value:          10,
        HotelModelId:   1,
        price:          1,
    }, );
    
    await newCard.save();
    await newUser.save();
    await otherUser.save();
    await newNew.save();
    
    //hotels
    await newHotel.save();
    await newNumber.save();
    
    //newHotel.findById(1, { include: ["NumberModel"] }).then()
    //newHotel.findAll({ include: ["NumberModel"] });
  
    console.log('done.');
}

THE_FUCKING_CURE()
