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
        nameCard:               { type: DataTypes.STRING,  allowNull: false, },
        verified:               { type: DataTypes.BOOLEAN, allowNull: false, },
    }, 
    { sequelize, modelName: 'CardModel', }
);

class CardTransfer extends Model { }
CardTransfer.init(
    {
        name:                   { type: DataTypes.STRING,  allowNull: false, },
        cityfrom:               { type: DataTypes.STRING,  allowNull: false, },
        cityto:                 { type: DataTypes.STRING,  allowNull: false, },
        datefrom:               { type: DataTypes.STRING,  allowNull: false, },
        dateto:                 { type: DataTypes.STRING,  allowNull: false, },
        timefrom:               { type: DataTypes.STRING,  allowNull: false, },
        timeto:                 { type: DataTypes.STRING,  allowNull: false, },
        typeCar:                { type: DataTypes.STRING,  allowNull: false, },
        car:                    { type: DataTypes.STRING,  allowNull: false, },
        passenger:              { type: DataTypes.INTEGER, allowNull: false, },
        price:                  { type: DataTypes.INTEGER, allowNull: false, },
        boardedPlaces:          { type: DataTypes.INTEGER, allowNull: true,  },
        verified:               { type: DataTypes.BOOLEAN, allowNull: false, },
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
        verified:               { type: DataTypes.BOOLEAN, allowNull: false, },
        
    }, 
    { sequelize, modelName: 'CardService', }
);

//booking

class HotelModel extends Sequelize.Model { }
HotelModel.init(
    {
        category:       { type: DataTypes.STRING,  allowNull: false, },
        subcategory:    { type: DataTypes.STRING,  allowNull: false, },
        title:          { type: DataTypes.STRING,  allowNull: false, },
        img:            { type: DataTypes.JSON,    allowNull: false, },
        p:              { type: DataTypes.STRING,  allowNull: false, },
        phone:          { type: DataTypes.STRING,  allowNull: false, },
        address:        { type: DataTypes.STRING,  allowNull: false, },
        price:          { type: DataTypes.INTEGER, allowNull: true,  },
        email:          { type: DataTypes.STRING,  allowNull: false, },
        verified:       { type: DataTypes.BOOLEAN, allowNull: false, },
    }, 
    { sequelize, modelName: 'HotelModel', }
);

class NumberModel extends Sequelize.Model { }
NumberModel.init(
    {
        name:           { type: DataTypes.STRING,  allowNull: false, },
        adults:         { type: DataTypes.INTEGER, allowNull: false, },
        children:       { type: DataTypes.INTEGER, allowNull: false, },
        description:    { type: DataTypes.STRING,  allowNull: false, },
        bookings:       { type: DataTypes.JSON,    allowNull: true,  },
        price:          { type: DataTypes.INTEGER, allowNull: true,  },
        // количество номеров тарифа
        value:          { type: DataTypes.INTEGER, allowNull: false, },
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
}
