let { sequelize, NewsModel, UserModel, CardModel } = require('./modules/models');

// ЭТА ХЕРНЯ ПОЧИНИТ БАЗЫ, ПЕРЕСОЗДАСТ ИХ, ВЫЛЕЧИТ ПРОСТАТИТ, 
// ПОДАРИТ ТЕБЕ ПЛОЙКУ И СЕКС, ВСЕГО ДВЕ ЛОЖКИ db_hard_reset.js И ГЛИСТЫ КОМОМ ВЫЙДУТ 

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
        title: "Что то",
        img: {},
        p: "Prototip",
        price: 1000,
        phone: "+79042065393",
        address: "Хуй внегородсикй",
        nameCard: "Если честно хз"
    });

    console.log('created card...');

    const newUser = await UserModel.create({
        username: 'Никита',
        surname: 'Лысенков',
        email: 'example@example.com',
        phone: '+79042065393',
        password: 'членовещание',
        role: "ADMIN"
    }, );

    console.log('created user...');

    const newNew = await NewsModel.create({
        title: 'example new',
        content: 'some content'
    }, );

    console.log('created new...');
    
    await newCard.save();
    await newUser.save();
    await newNew.save();
    
    console.log('done.');
}

THE_FUCKING_CURE()
