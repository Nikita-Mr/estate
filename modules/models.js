// здесь лежат все модели
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize({ dialect: 'sqlite', storage: 'db.sqlite' });

class NewsModel extends Model { }
NewsModel.init(
    {
        title:       { type: DataTypes.STRING, allowNull: false, },
        content:     { type: DataTypes.STRING, allowNull: false, }, 
    }, 
    { sequelize, modelName: 'NewsModel', }
);

class UserModel extends Model { }
UserModel.init(
    {
        username:    { type: DataTypes.STRING, allowNull: false, },
        surname:     { type: DataTypes.STRING, allowNull: false, }, 
        email:       { type: DataTypes.STRING, allowNull: false, }, 
        phone:       { type: DataTypes.STRING, allowNull: false, }, 
        password:    { type: DataTypes.STRING, allowNull: false, }, 
        role:        { type: DataTypes.STRING, allowNull: false, }, 
    }, 
    { sequelize, modelName: 'UserModel', }
);

class CardModel extends Model { }
CardModel.init(
    {
        category:       { type: DataTypes.STRING,  allowNull: false, }, 
        subcategory:    { type: DataTypes.STRING,  allowNull: false, },
        title:          { type: DataTypes.STRING,  allowNull: false, },
        img:            { type: DataTypes.JSON,  allowNull: false, },
        p:              { type: DataTypes.STRING,  allowNull: false, },
        price:          { type: DataTypes.INTEGER, allowNull: false, },
        phone:          { type: DataTypes.STRING,  allowNull: false, },
        address:        { type: DataTypes.STRING,  allowNull: false, },
        nameCard:       { type: DataTypes.STRING,  allowNull: false, },

    }, 
    { sequelize, modelName: 'CardModel', }
);

class CardImage extends Model { }
CardImage.init(
    { src:   { type: DataTypes.STRING,  allowNull: false, }, }, 
    { sequelize, modelName: 'CardImage', }
);
class CardTransfer extends Model { }
CardTransfer.init(
    {
        name:           { type: DataTypes.STRING,  allowNull: false, },
        cityfrom:       { type: DataTypes.STRING,  allowNull: false, },
        cityto:         { type: DataTypes.STRING,  allowNull: false, },
        datefrom:       { type: DataTypes.STRING,  allowNull: false, },
        dateto:         { type: DataTypes.STRING,  allowNull: false, },
        timefrom:       { type: DataTypes.STRING,  allowNull: false, },
        timeto:         { type: DataTypes.STRING,  allowNull: false, },
        walkfrom:       { type: DataTypes.STRING,  allowNull: false, },
        walkto:         { type: DataTypes.STRING,  allowNull: false, },
        typeCar:        { type: DataTypes.STRING,  allowNull: false, },
        car:            { type: DataTypes.STRING,  allowNull: false, },
        passenger:      { type: DataTypes.INTEGER,  allowNull: false, },
        price:          { type: DataTypes.INTEGER, allowNull: false, },
    }, 
    { sequelize, modelName: 'CardTransfer', }
);



module.exports = { sequelize, NewsModel, UserModel, CardModel, CardTransfer }
