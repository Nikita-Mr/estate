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
        category:       { type: DataTypes.STRING,  allowNull: false, }, // создать subcategory
        subcategory:    { type: DataTypes.STRING,  allowNull: false, },
        title:          { type: DataTypes.STRING,  allowNull: false, },
        img:            { type: DataTypes.STRING,  allowNull: false, },
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

//CardModel.hasMany(CardImage);
module.exports = { NewsModel, UserModel, CardModel }