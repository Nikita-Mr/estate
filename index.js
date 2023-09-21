// библиотеки
const express = require(`express`);
const session = require('express-session');
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const path = require('path');

// модули самого бэкенда
const {
  sequelize,
  NewsModel,
  UserModel,
  CardModel,
} = require('./modules/models');
const { secret } = require(`./config`);

let app = express();
let port = process.env.PORT || 3005;

app.listen(port, function () {
  console.log(`http://localhost:${port}`);
});

app.use(cors());

// Подключаем middleware для сессий
app.use(
  session({ secret: 'secret-key', resave: false, saveUninitialized: true })
);
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// Раздача статики

// Настройка POST-запроса — JSON
app.use(express.json());
app.use(fileUpload());
// Настройка POST-запроса
app.use(express.urlencoded({ extended: true }));

let generateAccessToken = (id, role) =>
  jwt.sign({ id, role }, secret, { expiresIn: '336h' });

let verifyc = function (roles) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') next();

    try {
      let token = req.headers.authorization;
      // if(token){
      //   return res.json({message: token})
      // }
      if (!token) return res.json({ message: 'Пользователь не авторизован' });

      let { role: userRoles } = jwt.verify(token, secret);
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) hasRole = true;
      });
      if (!hasRole) return res.json({ message: 'У вас нет доступа' });
      next();
    } catch (err) {
      return res.json({ message: 'Пользователь не авторизован' });
    }
  };
};
let ADMINVERIFY = function (roles) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    }
    try {
      let token = req.headers.authorization;
      // if(token){
      //   return res.json({message: token})
      // }
      if (!token) {
        return res.json({ message: 'Пользователь не авторизован' });
      }
      let { role: userRoles } = jwt.verify(token, secret);
      userRoles.forEach((role) => {
        if (role == 'ADMIN') {
          return res.json({ admin: true });
        }
      });
      next();
    } catch (err) {
      return res.json({ message: 'Пользователь не авторизован' });
    }
  };
};

// этот код нужен только для дебага, на проде убрать
// app.get('/', async function (req, res) { res.sendFile(path.join(__dirname, 'test.html')); });
app.get('/newsDebug', async function (req, res) {
  console.log(UserModel);
  let news = await UserModel.findAll();

  res.send({ news });
});

app.get(`/news`, async function (req, res) {
  let token = req.headers.authorization;
  let { role: userRoles } = jwt.verify(token, secret);
  let admin;
  if (token) {
    userRoles.forEach((role) => {
      if (role == 'ADMIN') admin = true;
    });
  }
  let news = await NewsModel.findAll();

  res.send({ news, admin });
});

app.get(`/habitationDebug`, async function (req, res) {
  console.log(CardModel);
  let name = req.query.name;
  let response = await CardModel.findAll({ where: { category: 'habitation' } });

  res.send({ response });
});
app.get(`/eventDebug`, async function (req, res) {
  let response = await CardModel.findAll({ where: { category: 'event' } });

  res.send({ response });
});
app.get(`/rentalDebug`, async function (req, res) {
  let response = await CardModel.findAll({ where: { category: 'rental' } });

  res.send({ response });
});
app.get(`/forChildrenDebug`, async function (req, res) {
  let response = await CardModel.findAll({
    where: { category: 'forChildren' },
  });

  res.send({ response });
});
app.get(`/instructor-toursDebug`, async function (req, res) {
  let response = await CardModel.findAll({
    where: { category: 'instructor-tours' },
  });

  res.send({ response });
});

app.get(`/habitation/items`, async function (req, res) {
  try {
    let name = req.query.name;
    let cards;
    let admin = false;
    let token = req.headers.authorization;
    console.log(token);
    let { role: userRoles } = jwt.verify(token, secret);
    console.log(userRoles);

    if (name) {
      cards = await CardModel.findAll({
        where: { category: 'habitation', subcategory: name },
      });
      if (token) {
        userRoles.forEach((role) => {
          if (role == 'ADMIN') {
            admin = true;
          }
        });
      }
    }
    res.send({ cards, admin });
  } catch (e) {
    res.send({ expired: true });
  }
});

let timeId;
app.post(`/upload`, async function (req, res) {
  let { name, id } = req.query;

  if (!req.files) {
    return res.send({ message: 'Файл не найден' });
  }
  if (req.file) {
    let file = req.file;
    file.mv(`./src/assets/img/${file.name}`, function (err) {
      if (err) {
        console.log(err);
        return res.send({ message: 'Error occured' });
      }
    });
    let card = await CardModel.findOne({ where: { id: timeId } });
    card.img = file.name;
    console.log(card);
    await card.save();
  }
  let files = req.files.files;
  let imgName = [];
  console.log(files);
  for (let i = 0; i < files.length; i++) {
    imgName.push(files[i].name);
    console.log(files[i]);
    files[i].mv(`./src/assets/img/${files[i].name}`, function (err) {
      if (err) {
        console.log(err);
        return res.send({ message: 'Error occured' });
      }
    });
  }
  if (name) {
    let card = await CardModel.findOne({ where: { id: id } });
    card.img = imgName;
    await card.save();
    return res.send({ message: 'Успешно', status: '200' });
  }
  let card = await CardModel.findOne({ where: { id: timeId } });
  card.img = imgName;
  console.log(card);
  await card.save();
  return res.send({ message: 'Успешно', status: '200' });
});
app.post(`/create-card`, async function (req, res) {
  try {
    let {
      title,
      price,
      p,
      edit,
      name,
      id,
      phone,
      adress,
      img,
      category,
    } = req.body;
    console.log(req.body)
    if (edit) {
      let card = await CardModel.findOne({ where: { id: id } });
      card.title = title;
      card.price = price;
      card.p = p;
      card.address = adress;
      card.phone = phone;
      card.img = img;
      await card.save();
      console.log(card);
      return res.json({ status: '200' });
    }
    let card = await CardModel.create({
      img: '',
      category: category,
      subcategory: name,
      title: title,
      price: price,
      p: p,
      phone: phone,
      address: adress,
      nameCard: "Пососи"
    });
    timeId = card.id;
    // await card.save();
    return res.send({ message: 'Успешно', status: '200' });
  } catch (e) {
    return res.send({ message: 'Ошибка', status: '400' });
  }
});

app.get(`/getUsers`, verifyc(['ADMIN']), async function (req, res) {
  try {
    let users = await User.find({});
    res.json({ users });
  } catch (e) {
    console.log(e);
  }
});

app.post(`/registration`, async function (req, res) {
  try {
    let { username, surname, email, number, password } = req.body;
    let candidateEmail = await UserModel.findOne({ where: { email: email } });
    let candidatePhone = await UserModel.findOne({ where: { phone: number } });

    if (candidatePhone) {
      return res.json({
        message: 'Пользователь с таким номером телефона уже существует',
        status: '400',
      });
    }
    if (candidateEmail) {
      return res.json({
        message: 'Пользователь с такой почтой уже существует',
        status: '400',
      });
    }
    let hashPassword = bcrypt.hashSync(password, 7);
    let newUser = await UserModel.create({
      username,
      surname,
      email,
      phone: number,
      password: hashPassword,
      role: 'USER',
    });
    console.log(newUser);
    await newUser.save();
    return res.json({
      message: 'Пользователь успешно зарегистрирован',
      status: '200',
    });
  } catch (err) {
    res.json({ message: 'Registration error', err });
  }
});
app.post(`/login`, async function (req, res) {
  try {
    let { email, password } = req.body;
    let user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.json({
        message: `Пользователь с почтой ${email} не найден`,
        status: 400,
      });
    }
    let validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.json({ message: 'Введен неверный пароль', status: 400 });
    }
    let token = generateAccessToken(user._id, [user.role]);
    return res.json({ token, message: 'Вошел', status: 200 });
  } catch (err) {
    res.json({ message: 'Login error' });
  }
});
app.post(`/deleteCard`, async function (req, res) {
  try {
    let { id, name } = req.body;

    if (name == `habitation`) {
      await Habinations.deleteOne({ _id: id });
    }
    if (name == `event`) {
      await Events.deleteOne({ _id: id });
    }
    if (name == `rental`) {
      await Rental.deleteOne({ _id: id });
    }
    if (name == `forChildren`) {
      await ForChildren.deleteOne({ _id: id });
    }
    if (name == `instructor-tours`) {
      await InstructorTours.deleteOne({ _id: id });
    }
    res.send({ status: '200' });
  } catch (e) {
    res.send({ message: 'Ошибка' });
  }
});
app.get(`/card`, async function (req, res) {
  let { id, name } = req.query;
  let card;
  let admin = false;
  let token = req.headers.authorization;
  console.log(token);
  let { role: userRoles } = jwt.verify(token, secret);
  console.log(userRoles);

  if (token) {
    userRoles.forEach((role) => {
      if (role == 'ADMIN') {
        admin = true;
      }
    });
  }
  card = await CardModel.findOne({ where: { id: id } });
  res.send({ card, admin });
});

app.get(`/instructor-tours/items`, async function (req, res) {
  try {
    let name = req.query.name;
    let cards;
    let admin = false;
    let token = req.headers.authorization;
    console.log(token);
    let { role: userRoles } = jwt.verify(token, secret);
    console.log(userRoles);

    if (name) {
      cards = await CardModel.findAll({
        where: { category: 'habitation', subcategory: name },
      });
      if (token) {
        userRoles.forEach((role) => {
          if (role == 'ADMIN') {
            admin = true;
          }
        });
      }
    }
    res.send({ cards, admin });
  } catch (e) {
    res.send({ expired: true });
  }
});

app.get(`/forChildren/items`, async function (req, res) {
  try {
    let name = req.query.name;
    let cards;
    let admin = false;
    let token = req.headers.authorization;
    console.log(token);
    let { role: userRoles } = jwt.verify(token, secret);
    console.log(userRoles);

    if (name) {
      cards = await CardModel.findAll({
        where: { category: 'habitation', subcategory: name },
      });
      if (token) {
        userRoles.forEach((role) => {
          if (role == 'ADMIN') {
            admin = true;
          }
        });
      }
    }
    res.send({ cards, admin });
  } catch (e) {
    res.send({ expired: true });
  }
});

app.get(`/rental/items`, async function (req, res) {
  try {
    let name = req.query.name;
    let cards;
    let admin = false;
    let token = req.headers.authorization;
    console.log(token);
    let { role: userRoles } = jwt.verify(token, secret);
    console.log(userRoles);

    if (name) {
      cards = await CardModel.findAll({
        where: { category: 'habitation', subcategory: name },
      });
      if (token) {
        userRoles.forEach((role) => {
          if (role == 'ADMIN') {
            admin = true;
          }
        });
      }
    }
    res.send({ cards, admin });
  } catch (e) {
    res.send({ expired: true });
  }
});

app.get(`/event/items`, async function (req, res) {
  try {
    let name = req.query.name;
    let cards;
    let admin = false;
    let token = req.headers.authorization;
    console.log(token);
    let { role: userRoles } = jwt.verify(token, secret);
    console.log(userRoles);

    if (name) {
      cards = await CardModel.findAll({
        where: { category: 'habitation', subcategory: name },
      });
      if (token) {
        userRoles.forEach((role) => {
          if (role == 'ADMIN') {
            admin = true;
          }
        });
      }
    }
    res.send({ cards, admin });
  } catch (e) {
    res.send({ expired: true });
  }
});

app.get(`/create_roles`, async function (req, res) {
  let user = new Role({ value: 'USER' });
  await user.save();
  let admin = new Role({ value: 'ADMIN' });
  await admin.save();
  res.redirect(`back`);
});
