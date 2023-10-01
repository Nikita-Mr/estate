// библиотеки
const express = require(`express`);
const session = require('express-session');
const fileUpload = require('express-fileupload');

const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

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

app.use('/assets', express.static('dist/assets'));

app.get('/', async function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
//app.use(fallback(path.join(__dirname, 'dist/index.html')))

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

app.get(`/habitation`, async function (req, res) {
  try {
    let { name, category } = req.query;

    let cards;
    let admin = false;
    let token = req.headers.authorization;
    console.log(token);
    let { role: userRoles } = jwt.verify(token, secret);
    console.log(userRoles);

    if (name) {
      cards = await CardModel.findAll({
        where: { category: category, subcategory: name },
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
  /*
  try{
    console.log('inited upload, id is: ', id);
    return res.send({ message: `inited upload, id: ${id}`, status: '200' }); }
  catch(e) { 
    console.log(`Ошибка id: ${e}`);
    return res.send({ message: `Ошибка id: ${e}`, status: '400' }); 
  }
  */
  if (!req.files) {
    console.log('no files sent!');
    return res.send({ message: 'Файл не найден' });
  }
  if (req.file) {
    let file = req.file;
    //let filename = files[i].name;
    let date = new Date();
    let time = date.getTime();
    let filename = `img_${time}.jpg`;
    imgName.push(filename);

    let mediaPath = path.join(__dirname, `dist/assets/img/user/`);
    let imgPath = path.join(mediaPath, filename);
    console.log('image path is: ', imgPath);

    await mkdirp(imgPath);
    fs.open(imgPath, 'w', function (err) {
      if (err) throw err;
      console.log('Saved!');
    });

    file.mv(imgPath, function (err) {
      if (err) {
        console.log(err);
        return res.send({ message: 'Error occured' });
      }
    });
    let card = await CardModel.findOne({ where: { id: timeId } });
    card.img = file.name;
    //console.log(card);
    await card.save();
    //return res.send({ message: 'Файл не найден' });
  }
  let files = req.files.files;
  let imgName = [];

  //console.log(files);
  for (let i = 0; i < files.length; i++) {
    //let filename = files[i].name;
    let date = new Date();
    let time = date.getTime();
    let filename = `img_${time}.jpg`;
    console.log('FILENAME IS: ', filename);
    imgName.push(filename);

    let mediaPath = path.join(__dirname, `dist/assets/img/user/`);
    let imgPath = path.join(mediaPath, filename);
    console.log('image path is: ', imgPath);

    fs.open(imgPath, 'w', async function (err) {
      if (err) {
        await mkdirp(mediaPath);
        fs.open(imgPath, 'w', function (err) {
          if (err) throw err;
        });
      }
      console.log('Saved!');
    });

    files[i].mv(imgPath, function (err) {
      if (err) {
        console.log('ERROR OCCURED WHEN SAVING FILE:', err);
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
  let card = await CardModel.findOne({ where: { id: id } });
  card.img = imgName;
  console.log(card);
  await card.save();
  return res.send({ message: 'Изображение загружено', status: '200' });
});


app.post(`/create_news`, async function(req, res) { 
  try { 
    let { title, content } = req.body 
    let news = await NewsModel.create({ 
      title, 
      content, 
    }); 
    await news.save(); 
    return res.json({ 
      message: 'Новость успешно создана', 
      status: '200', 
    }); 
  } catch (err) { 
    res.json({ message: 'Ошибка создания новости', err }); 
  } 
})

app.post(`/create-card`, async function (req, res) {
  try {
    let {
      title,
      price,
      p,
      edit,
      subcategory,
      id,
      phone,
      adress,
      img,
      category,
    } = req.body;
    //console.log(req.body)
    console.log('request received...');

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
    try {
      console.log('building card...');
      let card = await CardModel.build({
        img: {},
        category: category,
        subcategory: subcategory,
        title: title,
        price: price,
        p: p,
        phone: phone,
        address: adress,
        nameCard: 'undef',
      });
      console.log('saving card...');
      try {
        card.save().then((e) => {
          try {
            console.log('binding id...');
            timeId = card.id;
          } catch (e) {
            console.log(`Ошибка создания timeId: ${e} `);
            return res.send({
              message: `Ошибка создания timeId: ${e} `,
              status: '400',
            });
          }

          console.log('done.');
          return res.send({
            //message: `Создание карты завершено, timeId: ${timeId}`,
            message: timeId,
            status: '200',
          });
        });
      } catch (e) {
        console.log(`сохранение не работает: ${e} `);
        return res.send({
          message: `сохранение не работает: ${e} `,
          status: '400',
        });
      }
    } catch (e) {
      console.log(`Ошибка создания карточки: ${e} `);
      return res.send({
        message: `Ошибка создания карточки: ${e} `,
        status: '400',
      });
    }
  } catch (e) {
    console.log(`Ошибка: ${e}`);
    return res.send({ message: `Ошибка: ${e}`, status: '400' });
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
    //let validPassword = bcrypt.compareSync(password, user.password);
    let validPassword = true;
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
    let card = await CardModel.findOne({ where: { id: id } });
    await card.destroy();
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

app.get(`/instructor-tours`, async function (req, res) {
  try {
    let { name, category } = req.query;

    let cards;
    let admin = false;
    let token = req.headers.authorization;
    console.log(token);
    let { role: userRoles } = jwt.verify(token, secret);
    console.log(userRoles);

    if (name) {
      cards = await CardModel.findAll({
        where: { category: category, subcategory: name },
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

app.get(`/forChildren`, async function (req, res) {
  try {
    let { name, category } = req.query;

    let cards;
    let admin = false;
    let token = req.headers.authorization;
    console.log(token);
    let { role: userRoles } = jwt.verify(token, secret);
    console.log(userRoles);

    if (name) {
      cards = await CardModel.findAll({
        where: { category: category, subcategory: name },
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

app.get(`/rental`, async function (req, res) {
  try {
    let { name, category } = req.query;
    let cards;
    let admin = false;
    let token = req.headers.authorization;
    console.log(token);
    let { role: userRoles } = jwt.verify(token, secret);
    console.log(userRoles);

    if (name) {
      cards = await CardModel.findAll({
        where: { category: category, subcategory: name },
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

app.get(`/event`, async function (req, res) {
  try {
    let { name, category } = req.query;

    let cards;
    let admin = false;
    let token = req.headers.authorization;
    console.log(token);
    let { role: userRoles } = jwt.verify(token, secret);
    console.log(userRoles);

    if (name) {
      cards = await CardModel.findAll({
        where: { category: category, subcategory: name },
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
