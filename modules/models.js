// здесь лежат все модели
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize(
    //'a0864360_db',
    //'a0864360_db',
    //'password1',
    // { dialect: 'mysql', host: 'localhost' }
    { dialect: 'sqlite', storage: 'db.sqlite', logging: false }
);

class NewsModel extends Model { }
NewsModel.init(
    {
        title:                  { type: DataTypes.STRING, allowNull: false, },
        content:                { type: DataTypes.STRING, allowNull: false, }, 
    }, 
    { sequelize, modelName: 'NewsModel', }
);

class UserModel extends Model { }
UserModel.init(
    {
        username:               { type: DataTypes.STRING, allowNull: false, },
        surname:                { type: DataTypes.STRING, allowNull: false, }, 
        email:                  { type: DataTypes.STRING, allowNull: false, }, 
        phone:                  { type: DataTypes.STRING, allowNull: false, }, 
        password:               { type: DataTypes.STRING, allowNull: false, }, 
        role:                   { type: DataTypes.STRING, allowNull: false, }, 
        balance:                { type: DataTypes.INTEGER, allowNull: true, }, 
    }, 
    { sequelize, modelName: 'UserModel', }
);

// cards

class CardModel extends Model { }
CardModel.init(
    {
        category:               { type: DataTypes.STRING,  allowNull: false, }, 
        subcategory:            { type: DataTypes.STRING,  allowNull: false, },
        title:                  { type: DataTypes.STRING,  allowNull: false, },
        img:                    { type: DataTypes.JSON,    allowNull: false, },
        p:                      { type: DataTypes.STRING,  allowNull: false, },
        price:                  { type: DataTypes.INTEGER, allowNull: false, },
        phone:                  { type: DataTypes.STRING,  allowNull: false, },
        address:                { type: DataTypes.STRING,  allowNull: false, },
        email:                  { type: DataTypes.STRING,  allowNull: false, },
        chatID:                 { type: DataTypes.STRING,  allowNull: false, },
        nameCard:               { type: DataTypes.STRING,  allowNull: false, },
        userID:                 { type: DataTypes.BOOLEAN, allowNull: false, },
        verified:               { type: DataTypes.BOOLEAN, allowNull: false, },
    }, 
    { sequelize, modelName: 'CardModel', }
);

class CardTransfer extends Model { }
CardTransfer.init(
    {
        name:                   { type: DataTypes.STRING,  allowNull: false, },
        region:                 { type: DataTypes.STRING,  allowNull: false, },
        regionTo:               { type: DataTypes.STRING,  allowNull: false, },
        cityfrom:               { type: DataTypes.STRING,  allowNull: false, },
        cityto:                 { type: DataTypes.STRING,  allowNull: false, },
        datefrom:               { type: DataTypes.STRING,  allowNull: false, },
        timefrom:               { type: DataTypes.STRING,  allowNull: false, },
        typeCar:                { type: DataTypes.STRING,  allowNull: false, },
        car:                    { type: DataTypes.STRING,  allowNull: false, },
        passenger:              { type: DataTypes.INTEGER, allowNull: false, },
        price_sit:              { type: DataTypes.INTEGER, allowNull: false, },
        price_salon:            { type: DataTypes.INTEGER, allowNull: false, },
        length:                 { type: DataTypes.STRING,  allowNull: true,  },
        boardedPlaces:          { type: DataTypes.INTEGER, allowNull: true,  },
        chatID:                 { type: DataTypes.STRING,  allowNull: false, },
        userID:                 { type: DataTypes.BOOLEAN, allowNull: false, },
        verified:               { type: DataTypes.BOOLEAN, allowNull: false, },
        point:                  { type: DataTypes.STRING,  allowNull: false, },
        img:                    { type: DataTypes.JSON,    allowNull: false, },
    }, 
    { sequelize, modelName: 'CardTransfer', }
);

class CardService extends Model { }
CardService.init(
    {
        name:                   { type: DataTypes.STRING,  allowNull: false, },
        phone:                  { type: DataTypes.STRING,  allowNull: false, },
        description:            { type: DataTypes.STRING,  allowNull: false, },
        img:                    { type: DataTypes.JSON,    allowNull: false, },
        chatID:                 { type: DataTypes.STRING,  allowNull: false, },
        userID:                 { type: DataTypes.BOOLEAN, allowNull: false, },
        verified:               { type: DataTypes.BOOLEAN, allowNull: false, },
        
    }, 
    { sequelize, modelName: 'CardService', }
);

//booking

class HotelModel extends Sequelize.Model { }
HotelModel.init(
    {
        category:                   { type: DataTypes.STRING,  allowNull: false, },
        subcategory:                { type: DataTypes.STRING,  allowNull: false, },
        title:                      { type: DataTypes.STRING,  allowNull: false, },
        address:                    { type: DataTypes.STRING,  allowNull: false, },
        img:                        { type: DataTypes.JSON,    allowNull: false, },
        p:                          { type: DataTypes.STRING,  allowNull: true, },
        phone:                      { type: DataTypes.STRING,  allowNull: false, },
        price:                      { type: DataTypes.INTEGER, allowNull: true,  },
        email:                      { type: DataTypes.STRING,  allowNull: false, },
        chatID:                     { type: DataTypes.STRING,  allowNull: true, },
        userID:                     { type: DataTypes.BOOLEAN, allowNull: false, },
        verified:                   { type: DataTypes.BOOLEAN, allowNull: false, },

        floor:                      { type: DataTypes.INTEGER, allowNull: true,  },
        lease_term:                 { type: DataTypes.INTEGER, allowNull: true,  },
        total_area:                 { type: DataTypes.INTEGER, allowNull: true,  },   
        sleeping_rooms:             { type: DataTypes.INTEGER, allowNull: true,  },   
        sleeping_places:            { type: DataTypes.INTEGER, allowNull: true,  },
        children_bed:               { type: DataTypes.STRING, allowNull: true,   },
        double_places:              { type: DataTypes.INTEGER, allowNull: true,  },
        single_spaces:              { type: DataTypes.INTEGER, allowNull: true,  },
        additional_sleeping_places: { type: DataTypes.INTEGER, allowNull: true,  },
        bathrooms:                  { type: DataTypes.INTEGER, allowNull: true,  },
        bathrooms_showers:          { type: DataTypes.INTEGER, allowNull: true,  },
        drying_for_inventory:       { type: DataTypes.STRING, allowNull: true,   },
        wifi:                       { type: DataTypes.STRING, allowNull: true,   },
        warm_floor:                 { type: DataTypes.STRING, allowNull: true,   },
        dishwasher:                 { type: DataTypes.STRING, allowNull: true,   },
        parking_cars:               { type: DataTypes.INTEGER, allowNull: true,  },
        mall:                       { type: DataTypes.STRING, allowNull: true,   },
        kazan:                      { type: DataTypes.STRING, allowNull: true,   },
        bath_territory:             { type: DataTypes.STRING, allowNull: true,   },
        pool:                       { type: DataTypes.STRING, allowNull: true,   },
        transfer_city:              { type: DataTypes.STRING, allowNull: true,   },
        transfer_mountain:          { type: DataTypes.STRING, allowNull: true,   },
        live_whith_animals:         { type: DataTypes.STRING, allowNull: true,   },
        additionally:               { type: DataTypes.STRING, allowNull: true,   },
    }, 
    { sequelize, modelName: 'HotelModel', }
);

class NumberModel extends Sequelize.Model { }
NumberModel.init(
    {
        title:                      { type: DataTypes.STRING,  allowNull: false, },
        bookings:                   { type: DataTypes.JSON,    allowNull: true,  },
        // количество номеров тарифа
        floor:                      { type: DataTypes.INTEGER, allowNull: true,  },
        lease_term:                 { type: DataTypes.INTEGER, allowNull: true,  },
        total_area:                 { type: DataTypes.INTEGER, allowNull: true,  },   
        sleeping_rooms:             { type: DataTypes.INTEGER, allowNull: true,  },   
        sleeping_places:            { type: DataTypes.INTEGER, allowNull: true,  },
        children_bed:               { type: DataTypes.STRING, allowNull: true,   },
        double_places:              { type: DataTypes.INTEGER, allowNull: true,  },
        single_spaces:              { type: DataTypes.INTEGER, allowNull: true,  },
        additional_sleeping_places: { type: DataTypes.INTEGER, allowNull: true,  },
        bathrooms:                  { type: DataTypes.INTEGER, allowNull: true,  },
        bathrooms_showers:          { type: DataTypes.INTEGER, allowNull: true,  },
        drying_for_inventory:       { type: DataTypes.STRING, allowNull: true,   },
        wifi:                       { type: DataTypes.STRING, allowNull: true,   },
        warm_floor:                 { type: DataTypes.STRING, allowNull: true,   },
        dishwasher:                 { type: DataTypes.STRING, allowNull: true,   },
        parking_cars:               { type: DataTypes.INTEGER, allowNull: true,  },
        mall:                       { type: DataTypes.STRING, allowNull: true,   },
        kazan:                      { type: DataTypes.STRING, allowNull: true,   },
        bath_territory:             { type: DataTypes.STRING, allowNull: true,   },
        pool:                       { type: DataTypes.STRING, allowNull: true,   },
        transfer_city:              { type: DataTypes.STRING, allowNull: true,   },
        transfer_mountain:          { type: DataTypes.STRING, allowNull: true,   },
        live_whith_animals:         { type: DataTypes.STRING, allowNull: true,   },
        additionally:               { type: DataTypes.STRING, allowNull: true,   },
    },
    { sequelize, modelName: 'NumberModel', }
);


class LiftModel extends Sequelize.Model { }
LiftModel.init(
    {
        title:                    { type: DataTypes.STRING,  allowNull: false, },
        geo:                      { type: DataTypes.STRING,  allowNull: false, },
        lifting_time:             { type: DataTypes.STRING,  allowNull: false, },
        phone:                    { type: DataTypes.STRING,  allowNull: false, },
        price:                    { type: DataTypes.INTEGER, allowNull: true,  },
        working_hours_start:      { type: DataTypes.STRING,  allowNull: true,  },
        working_hours_finish:     { type: DataTypes.STRING,  allowNull: false, },
    }, 
    { sequelize, modelName: 'LiftModel', }
);
class SkipassModel extends Sequelize.Model { }
SkipassModel.init(
    {
        title:                    { type: DataTypes.STRING,  allowNull: false, },
        content:                  { type: DataTypes.STRING,  allowNull: false, },
        price:                    { type: DataTypes.INTEGER, allowNull: true,  },
    }, 
    { sequelize, modelName: 'SkipassModel', }
);

class RequestPaymentModel extends Sequelize.Model { }
RequestPaymentModel.init(
    {
        userID:                   { type: DataTypes.STRING,  allowNull: false, },
        username:                 { type: DataTypes.STRING,  allowNull: false, },
        surname:                  { type: DataTypes.STRING,  allowNull: false, },
        card_number:              { type: DataTypes.STRING,  allowNull: false, },
        phone:                    { type: DataTypes.STRING,  allowNull: false, },
        amount:                   { type: DataTypes.INTEGER, allowNull: false, },
        done:                     { type: DataTypes.BOOLEAN, allowNull: true, },
    }, 
    { sequelize, modelName: 'RequestPaymentModel', }
);


// finalizing hotel models
HotelModel.hasMany(NumberModel, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as:       'NumberModel',
});
NumberModel.belongsTo(HotelModel, {
  foreignKey: 'HotelModelId',
  as:         'HotelModel',
});

// finalize
module.exports = { 
    sequelize, 
    NewsModel, 
    UserModel, 
    CardModel, 
    CardTransfer, 
    CardService, 
    HotelModel, 
    NumberModel,
    LiftModel,
    SkipassModel,
    RequestPaymentModel
}
