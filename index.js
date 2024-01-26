// библиотеки
const express = require(`express`);
const session = require("express-session");
const fileUpload = require("express-fileupload");

const multer = require("multer");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const nodemailer = require("nodemailer");

const TelegramApi = require("node-telegram-bot-api");
// const tokenBot = "6512089922:AAEkul2Yw8aIIfh0A4vSypeC1kXJaTNDs9Y";

// let bot = new TelegramApi(tokenBot, { polling: true });

// bot.on(`message`, (msg) => {
//   let text = msg.text;
//   let chatID = msg.chat.id;
//   if (text == "/start") {
//     bot.sendMessage(chatID, `ваш чат ID: ${chatID}`);
//   }
// });

// модули самого бэкенда
const {
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
  RequestPaymentModel,
  RequestsModel,
} = require("./modules/models");
const { secret } = require(`./config`);

const { tryBook, addNumber } = require(`./modules/booking`);

const { initPayment, awaitPayment } = require(`./modules/payments`);
const { name } = require("dayjs/locale/ru");
const internal = require("stream");
const { default: axios } = require("axios");

let app = express();
let port = process.env.PORT || 3005;

app.listen(port, function () {
  console.log(`http://localhost:${port}`);
});

app.use(cors());

// Подключаем middleware для сессий
app.use(
  session({ secret: "secret-key", resave: false, saveUninitialized: true })
);
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Раздача статики

// Настройка POST-запроса — JSON
app.use(express.json());
app.use(fileUpload());
// Настройка POST-запроса
app.use(express.urlencoded({ extended: true }));

let generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, secret, { expiresIn: "336h" });
};

let verifyc = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") next();

    try {
      let token = req.headers.authorization;
      // if(token){
      //   return res.json({message: token})
      // }
      if (!token) return res.json({ message: "Пользователь не авторизован" });

      let { role: userRoles } = jwt.verify(token, secret);
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) hasRole = true;
      });
      if (!hasRole) return res.json({ message: "У вас нет доступа" });
      next();
    } catch (err) {
      return res.json({ message: "Пользователь не авторизован" });
    }
  };
};
let ADMINVERIFY = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      let token = req.headers.authorization;
      // if(token){
      //   return res.json({message: token})
      // }
      if (!token) {
        return res.json({ message: "Пользователь не авторизован" });
      }
      let { role: userRoles } = jwt.verify(token, secret);
      userRoles.forEach((role) => {
        if (role == "ADMIN") {
          return res.json({ admin: true });
        }
      });
      next();
    } catch (err) {
      return res.json({ message: "Пользователь не авторизован" });
    }
  };
};

app.use("/assets", express.static("dist/assets"));

// фикс вылета на перезагрузке
app.route("/*").get(function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});
app.get("/", async function (req, res) {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});
//app.use(fallback(path.join(__dirname, 'dist/index.html')))

app.get("/newsDebug", async function (req, res) {
  console.log(UserModel);
  let news = await UserModel.findAll();

  res.send({ news });
});

app.post(`/filter`, async function (req, res) {
  let { namefilter, cityfrom, cityto, datefrom, passenger } = req.body;
  let filter;
  let Array = [];
  console.log(cityfrom);
  filter = await CardTransfer.findAll({
    where: {
      cityfrom: cityfrom,
      cityto: cityto,
      datefrom: datefrom,
      verified: true,
    },
  });
  filter.forEach((element) => {
    if (passenger <= element.passenger) {
      Array.push(element);
    }
  });

  if (!filter) {
    res.send({ message: "В этот промежуток поездок нет" });
    return;
  }
  res.send({ Array });
});

app.post(`/transfer`, async function (req, res) {
  try {
    let { id, book } = req.body;
    let admin = false;
    if (book && id) {
      let transfer = await CardTransfer.findOne({ where: { id: id } });
      if (transfer.boardedPlaces >= transfer.passenger) {
        return res.send({ message: "Мест нет" });
      }
      transfer.boardedPlaces += 1;
      await transfer.save();
      res.send({ transfer, admin });
      return;
    }
    if (id && !book) {
      let transfer = await CardTransfer.findOne({ where: { id: id } });
      res.send({ transfer, admin });
      return;
    }
    let transfer = await CardTransfer.findAll();
    transfer.reverse();
    res.send({ transfer, admin });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/transfer_edit`, async function (req, res) {
  try {
    let { id } = req.body;
    if (id) {
      let card = await CardTransfer.findOne({ where: { id } });
      res.send({ card });
    } else {
      res.send({ success: false, message: "Объявление не найдено" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/news`, async function (req, res) {
  let admin;
  let { id } = req.body;
  let user;
  if (id) {
    user = await UserModel.findOne({ id: id });
    if (user.role == "ADMIN") {
      admin = true;
    } else {
      admin = false;
    }
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
    let { role: userRoles } = jwt.verify(token, secret);

    if (name) {
      cards = await HotelModel.findAll({
        where: { category: category, subcategory: name, verified: true },
      });

      if (token) {
        userRoles.forEach((role) => {
          if (role == "ADMIN") {
            admin = true;
          }
        });
      }
    }

    res.send({ expired: false, cards, admin });
  } catch (e) {
    console.log(e);
    res.send({ expired: "1" });
  }
});

app.post(`/habitation`, async function (req, res) {
  try {
    let { name, category, id } = req.body;
    let cards;
    let admin = false;
    let user;
    if (id) {
      user = await UserModel.findOne({ where: { id } });
      if (user.role == "ADMIN") {
        admin = true;
      }
    }
    if (name) {
      cards = await HotelModel.findAll({
        where: { category: category, subcategory: name, verified: true },
      });
    }

    res.send({ expired: false, cards, admin });
  } catch (e) {
    console.log(e);
    res.send({ expired: "1" });
  }
});

let timeId;
app.post(`/upload`, async function (req, res) {
  let { id, model, category } = req.query;
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
    console.log("no files sent!");
    return res.send({ message: "Файл не найден" });
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
    console.log("image path is: ", imgPath);

    await mkdirp(imgPath);
    fs.open(imgPath, "w", function (err) {
      if (err) throw err;
      console.log("Saved!");
    });

    file.mv(imgPath, function (err) {
      if (err) {
        console.log(err);
        return res.send({ message: "Error occured" });
      }
    });
    if (model == "taxi") {
      let service = await CardService.findOne({ where: { id: timeId } });
      service.img = file.name;
      //console.log(card);
      await service.save();
    } else if (model == "transfer") {
      let transfer = await CardTransfer.findOne({ where: { id: timeId } });
      transfer.img = file.name;
      await transfer.save();
    } else {
      let card = await HotelModel.findOne({ where: { id: timeId } });
      card.img = file.name;
      //console.log(card);
      await card.save();
      //return res.send({ message: 'Файл не найден' });
    }
    if (category != `habitation`) {
      let card = await CardModel.findOne({ where: { id: timeId } });
      card.img = file.name;
      //console.log(card);
      await card.save();
    }
  }
  let files = req.files.files;
  let imgName = [];

  //console.log(files);
  for (let i = 0; i < files.length; i++) {
    //let filename = files[i].name;
    let date = new Date();
    let time = date.getTime();
    let filename = `img_${time}.jpg`;
    console.log("FILENAME IS: ", filename);
    imgName.push(filename);

    let mediaPath = path.join(__dirname, `dist/assets/img/user/`);
    let imgPath = path.join(mediaPath, filename);
    console.log("image path is: ", imgPath);

    fs.open(imgPath, "w", async function (err) {
      if (err) {
        await mkdirp(mediaPath);
        fs.open(imgPath, "w", function (err) {
          if (err) throw err;
        });
      }
      console.log("Saved!");
    });

    files[i].mv(imgPath, function (err) {
      if (err) {
        console.log("ERROR OCCURED WHEN SAVING FILE:", err);
        return res.send({ message: "Error occured" });
      }
    });
  }
  if (model == "taxi") {
    let card = await CardService.findOne({ where: { id: id } });
    card.img = imgName;
    await card.save();
    return res.send({ message: "Успешно", status: "200" });
  } else if (model == "transfer") {
    let transfer = await CardTransfer.findOne({ where: { id: id } });
    transfer.img = imgName;
    await transfer.save();
    return res.send({ message: "Успешно", status: "200" });
  } else {
    if (category == `habitation`) {
      let card = await HotelModel.findOne({ where: { id: id } });
      card.img = imgName;
      await card.save();
      return res.send({ message: "Успешно", status: "200" });
    } else if (category != `habitation`) {
      let card = await CardModel.findOne({ where: { id: id } });
      card.img = imgName;
      await card.save();
      return res.send({ message: "Успешно", status: "200" });
    }
    if (category != `habitation`) {
      let card = await CardModel.findOne({ where: { id: id } });
      card.img = imgName;
      await card.save();
      return res.send({ message: "Успешно", status: "200" });
    }
    let card = await HotelModel.findOne({ where: { id: id } });
    card.img = imgName;
    console.log(card);
    await card.save();
    return res.send({ message: "Изображение загружено", status: "200" });
  }
});

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
      email,
      chatID,
      userID,
      img,
      category,
    } = req.body;
    //console.log(req.body)
    console.log("request received...");
    if (category == `habitation`) {
      if (edit) {
        let card = await HotelModel.findOne({ where: { id: id } });
        card.title = title;
        card.price = price;
        card.p = p;
        card.address = adress;
        card.phone = phone;
        card.img = img;
        card.email = email;
        card.chatID = chatID;
        card.userID = userID;
        card.verified = false;
        await card.save();
        console.log(card);
        return res.json({ status: "200" });
      }
      try {
        console.log("building card...");
        let card = await HotelModel.build({
          img: {},
          category: category,
          subcategory: subcategory,
          title: title,
          price: price,
          p: p,
          phone: phone,
          address: adress,
          email: email,
          chatID: chatID,
          nameCard: "no",
          userID: userID,
          verified: false,
        });
        console.log("saving card...");
        try {
          card.save().then((e) => {
            try {
              console.log("binding id...");
              timeId = card.id;
            } catch (e) {
              console.log(`Ошибка создания timeId: ${e} `);
              return res.send({
                message: `Ошибка создания timeId: ${e} `,
                status: "400",
              });
            }

            console.log("done.");
            return res.send({
              //message: `Создание карты завершено, timeId: ${timeId}`,
              message: timeId,
              status: "200",
            });
          });
        } catch (e) {
          console.log(`сохранение не работает: ${e} `);
          return res.send({
            message: `сохранение не работает: ${e} `,
            status: "400",
          });
        }
      } catch (e) {
        console.log(`Ошибка создания карточки: ${e} `);
        return res.send({
          message: `Ошибка создания карточки: ${e} `,
          status: "400",
        });
      }
    } else {
      if (edit) {
        let card = await CardModel.findOne({ where: { id: id } });
        card.title = title;
        card.price = price;
        card.p = p;
        card.address = adress;
        card.phone = phone;
        card.email = email;
        card.img = img;
        card.verified = false;
        await card.save();
        console.log(card);
        return res.json({ status: "200" });
      }
      try {
        console.log("building card...");
        let card = await CardModel.build({
          img: {},
          category: category,
          subcategory: subcategory,
          title: title,
          price: price,
          p: p,
          phone: phone,
          address: adress,
          email: email,
          nameCard: "no",
          verified: false,
        });
        console.log("saving card...");
        try {
          card.save().then((e) => {
            try {
              console.log("binding id...");
              timeId = card.id;
            } catch (e) {
              console.log(`Ошибка создания timeId: ${e} `);
              return res.send({
                message: `Ошибка создания timeId: ${e} `,
                status: "400",
              });
            }

            console.log("done.");
            return res.send({
              //message: `Создание карты завершено, timeId: ${timeId}`,
              message: timeId,
              status: "200",
            });
          });
        } catch (e) {
          console.log(`сохранение не работает: ${e} `);
          return res.send({
            message: `сохранение не работает: ${e} `,
            status: "400",
          });
        }
      } catch (e) {
        console.log(`Ошибка создания карточки: ${e} `);
        return res.send({
          message: `Ошибка создания карточки: ${e} `,
          status: "400",
        });
      }
    }
  } catch (e) {
    console.log(`Ошибка: ${e}`);
    return res.send({ message: `Ошибка: ${e}`, status: "400" });
  }
});

app.get(`/getUsers`, verifyc(["ADMIN"]), async function (req, res) {
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
        message: "Пользователь с таким номером телефона уже существует",
        status: "400",
      });
    }
    if (candidateEmail) {
      return res.json({
        message: "Пользователь с такой почтой уже существует",
        status: "400",
      });
    }
    let hashPassword = bcrypt.hashSync(password, 7);
    let newUser = await UserModel.create({
      username,
      surname,
      email,
      phone: number,
      password: hashPassword,
      role: "USER",
      balance: 0
    });
    console.log(newUser);
    await newUser.save();
    return res.json({
      message: "Пользователь успешно зарегистрирован",
      status: "200",
    });
  } catch (err) {
    res.json({ message: "Registration error", err });
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

    // let validPassword = bcrypt.compareSync(password, user.password);
    validPassword = true;
    if (!validPassword) {
      return res.json({ message: "Введен неверный пароль", status: 400 });
    }
    let token = generateAccessToken(user.id, [user.role]);
    return res.json({ token, message: "Успешно", status: 200, id: user.id });
  } catch (err) {
    res.json({ message: "Login error" });
  }
});
app.post(`/deleteCard`, async function (req, res) {
  try {
    let { id, name } = req.body;
    let card;
    if (name == `habitation`) {
      card = await HotelModel.findOne({ where: { id: id } });
    } else {
      card = await CardModel.findOne({ where: { id: id } });
    }
    await card.destroy();
    res.send({ status: "200" });
  } catch (e) {
    res.send({ message: "Ошибка" });
  }
});

app.post(`/card`, async function (req, res) {
  try {
    let { id, name, view } = req.body;
    let card;
    let number;
    if (name == `habitation`) {
      if (view) {
        card = await HotelModel.findOne({ where: { id: id, verified: false } });
        number = await NumberModel.findAll({ where: { HotelModelId: id } });
      } else {
        card = await HotelModel.findOne({ where: { id: id, verified: true } });
        number = await NumberModel.findAll({ where: { HotelModelId: id } });
      }
    } else {
      card = await CardModel.findOne({ where: { id: id, verified: true } });
    }
    res.send({ card, number, view });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/instructor-tours`, async function (req, res) {
  try {
    let { name, category, id } = req.body;
    let cards;
    let admin = false;
    let user;
    if (id) {
      user = await UserModel.findOne({ where: { id } });
      if (user.role == "ADMIN") {
        admin = true;
      } else {
        admin = false;
      }
    }

    if (name) {
      cards = await CardModel.findAll({
        where: { category: category, subcategory: name, verified: true },
      });
    }
    res.send({ expired: false, cards, admin });
  } catch (e) {
    console.log(e);
  }
});

app.post(`/forChildren`, async function (req, res) {
  try {
    let { name, category, id } = req.body;

    let cards;
    let admin = false;
    let user;
    if (id) {
      user = await UserModel.findOne({ where: { id } });
      if (user.role == "ADMIN") {
        admin = true;
      } else {
        admin = false;
      }
    }

    if (name) {
      cards = await CardModel.findAll({
        where: { category: category, subcategory: name, verified: true },
      });
    }
    res.send({ expired: false, cards, admin });
  } catch (e) {
    console.log(e);
  }
});

app.post(`/rental`, async function (req, res) {
  try {
    let { name, category, id } = req.body;
    let cards;
    let admin = false;
    let user;
    if (id) {
      user = await UserModel.findOne({ where: { id } });
      if (user.role == "ADMIN") {
        admin = true;
      } else {
        admin = false;
      }
    }

    if (name) {
      cards = await CardModel.findAll({
        where: { category: category, subcategory: name, verified: true },
      });
    }
    res.send({ expired: false, cards, admin });
  } catch (e) {
    console.log(e);
  }
});

app.post(`/event`, async function (req, res) {
  try {
    let { name, category, id } = req.body;

    let cards;
    let admin = false;
    let user;
    if (id) {
      user = await UserModel.findOne({ where: { id } });
      if (user.role == "ADMIN") {
        admin = true;
      } else {
        admin = false;
      }
    }

    if (name) {
      cards = await CardModel.findAll({
        where: { category: category, subcategory: name, verified: true },
      });
    }
    res.send({ expired: false, cards, admin });
  } catch (e) {
    console.log(e);
  }
});
app.post(`/ads`, async function (req, res) {
  try {
    let { name, category, id } = req.body;
    let cards;
    let admin = false;
    let user;
    if (id) {
      user = await UserModel.findOne({ where: { id } });
      if (user.role == "ADMIN") {
        admin = true;
      } else {а
        admin = false;
      }
    }
    if (name) {
      cards = await CardModel.findAll({
        where: { category: category, subcategory: name, verified: true },
      });
    }
    res.send({ expired: false, cards, admin });
  } catch (e) {
    console.log(e);
  }
});

app.get(`/create_roles`, async function (req, res) {
  let user = new Role({ value: "USER" });
  await user.save();
  let admin = new Role({ value: "ADMIN" });
  await admin.save();
  res.redirect(`back`);
});

app.post(`/create_news`, async function (req, res) {
  try {
    let { title, content } = req.body;
    let news = await NewsModel.create({
      title,
      content,
    });
    await news.save();
    return res.send({
      message: "Новость успешно создана",
      success: true,
      status: 200,
    });
  } catch (err) {
    res.send({ message: "Ошибка создания новости", success: false, err });
  }
});

app.post(`/delete_news`, async function (req, res) {
  try {
    let id = req.body.id;
    let newsDelete = await NewsModel.findOne({ where: { id: id } });
    console.log(newsDelete, id);
    await newsDelete.destroy();
    res.json({ message: "Удаление прошло успешно", status: 200 });
  } catch (err) {
    res.json({ message: "Ошибка удаления новости", err });
  }
});

app.post(`/create_transfer`, async function (req, res) {
  try {
    let {
      name,
      region,
      regionTo,
      cityfrom,
      cityto,
      datefrom,
      timefrom,
      car,
      typeCar,
      passenger,
      price_sit,
      price_salon,
      length,
      chatID,
      point,
      userID,
      edit,
      id
    } = req.body;
    try {
      if (edit) {
        if (id) {
          console.log(region)
          let card = await CardTransfer.findOne({ where: { id } })
          card.name = name
          card.region = region
          card.cityfrom = cityfrom
          card.cityto = cityto
          card.datefrom = datefrom
          card.timefrom = timefrom
          card.car = car
          card.typeCar = typeCar
          card.passenger = passenger
          card.price_sit = price_sit
          card.price_salon = price_salon
          card.length = length
          card.chatID = chatID
          card.point = point
          card.regionTo = regionTo
          await card.save()
          res.send({ success: true, error: 'Сохранение прошло успешно', status: 200 })
        } else {
          res.send({ success: false, error: 'Ошибка', status: 400 })
        }
      } else {
        console.log("building card...");
        let card = await CardTransfer.build({
          name: name,
          region: region,
          regionTo: regionTo,
          cityfrom: cityfrom,
          cityto: cityto,
          datefrom: datefrom,
          price_salon: price_salon,
          timefrom: timefrom,
          price_sit: price_sit,
          car: car,
          typeCar: typeCar,
          passenger: passenger,
          length: length,
          chatID: chatID,
          userID: userID,
          verified: false,
          point: point,
          img: {},
        });
        console.log("saving card...");
        try {
          card.save().then((e) => {
            try {
              console.log("binding id...");
              timeId = card.id;
            } catch (e) {
              console.log(`Ошибка создания timeId: ${e} `);
              return res.send({
                message: `Ошибка создания timeId: ${e} `,
                status: "400",
                show: false,
              });
            }

            console.log("done.");
            return res.send({
              //message: `Создание карты завершено, timeId: ${timeId}`,
              message: timeId,
              error: "Запрос успешно добавлен",
              status: "200",
              success: true,
              show: true,
            });
          });
        } catch (e) {
          console.log(`сохранение не работает: ${e} `);
          return res.send({
            message: `сохранение не работает: ${e} `,
            status: "400",
            show: false,
          });
        }
      }
    } catch (e) {
      console.log(`Ошибка создания карточки: ${e} `);
      return res.send({
        message: `Ошибка создания карточки: ${e} `,
        status: "400",
        show: false,
      });
    }
  } catch (err) {
    res.send({
      message: "Ошибка создания трансфера",
      show: false,
      err,
      success: false,
    });
  }
});

app.post(`/delete_transfer`, async function (req, res) {
  try {
    let { id } = req.body;
    if (id) {
      let transfer = await CardTransfer.findOne({ where: { id } });
      await transfer.destroy();
      res.send({ status: 200, success: true });
    } else {
      res.send({ success: 400, message: "Ошибка удаления трансфера" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/create_service`, async function (req, res) {
  try {
    let { name, phone, description, userID } = req.body;
    try {
      console.log("building card...");
      let card = await CardService.build({
        img: {},
        name: name,
        phone: phone,
        description: description,
        userID: userID,
        verified: false,
      });
      console.log("saving card...");
      try {
        card.save().then((e) => {
          try {
            console.log("binding id...");
            timeId = card.id;
          } catch (e) {
            console.log(`Ошибка создания timeId: ${e} `);
            return res.send({
              message: `Ошибка создания timeId: ${e} `,
              status: "400",
            });
          }

          console.log("done.");
          return res.send({
            //message: `Создание карты завершено, timeId: ${timeId}`,
            message: timeId,
            error: "Запрос успешно добавлен",
            status: "200",
            success: true,
          });
        });
      } catch (e) {
        console.log(`сохранение не работает: ${e} `);
        return res.send({
          message: `сохранение не работает: ${e} `,
          status: "400",
        });
      }
    } catch (e) {
      console.log(`Ошибка создания карточки: ${e} `);
      return res.send({
        message: `Ошибка создания карточки: ${e} `,
        status: "400",
      });
    }
  } catch (err) {
    res.send({
      message: "Ошибка создания услуги",
      show: false,
      err,
      success: false,
    });
  }
});

app.post(`/services`, async function (req, res) {
  let { id } = req.body;
  let admin = false;
  let user;
  if (id) {
    user = await UserModel.findOne({ where: { id } });
    if (user.role == "ADMIN") {
      admin = true;
    } else {
      admin = false;
    }
  }
  let services = await CardService.findAll();
  res.send({ services, admin });
});

app.post(`/service-card`, async function (req, res) {
  try {
    let id = req.body.id;
    let card = await CardService.findOne({ where: { id: id } });
    res.send({ card });
  } catch (err) {
    res.send({ message: "Такой услуги не найдено", show: false, err });
  }
});

app.get(`/delete_service`, async function (req, res) {
  let services = await CardService.findAll();
  for (let i = 0; i < services.length; i++) {
    let service = services[i];
    await service.destroy();
  }
});

app.post(`/trybook`, async function (req, res) {
  let { phone, fromdate, todate, id, number } = req.body;
  let singleHotel = await HotelModel.findByPk(id, { include: ["NumberModel"] });
  console.log(singleHotel);
  let gottaBook = singleHotel.NumberModel[number];
  let checkin = new Date(fromdate);
  let checkout = new Date(todate);
  let response = await tryBook(gottaBook, checkin, checkout, phone);
  res.send(response);
});

app.post(`/create-number`, async function (req, res) {
  try {
    let { hotel, name, adults, children, description, value, price } = req.body;
    console.log(`creating number...`);
    await addNumber(hotel, name, adults, children, description, value, price);
    console.log(`number create`);
    res.send({ message: `Готово`, status: `200` });
  } catch (err) {
    res.send({ error: err, status: `400` });
  }
});
app.post(`/number`, async function (req, res) {
  try {
    let { id } = req.body;
    let number = [];
    if (id) {
      number = await NumberModel.findAll({ where: { HotelModelId: id } });
    }
    return res.send({ number });
  } catch (err) {
    return res.send({ error: err });
  }
});

app.post(`/create_lift`, async function (req, res) {
  try {
    let {
      title,
      geo,
      lifting_time,
      phone,
      price,
      working_hours_start,
      working_hours_finish,
    } = req.body;
    try {
      console.log("building card...");
      let card = await LiftModel.build({
        title: title,
        geo: geo,
        lifting_time: lifting_time,
        phone: phone,
        price: price,
        working_hours_start: working_hours_start,
        working_hours_finish: working_hours_finish,
      });
      console.log("saving card...");
      try {
        card.save().then((e) => {
          try {
            console.log("binding id...");
            timeId = card.id;
          } catch (e) {
            console.log(`Ошибка создания timeId: ${e} `);
            return res.send({
              message: `Ошибка создания timeId: ${e} `,
              status: "400",
            });
          }

          console.log("done.");
          return res.send({
            //message: `Создание карты завершено, timeId: ${timeId}`,
            message: timeId,
            status: "200",
          });
        });
      } catch (e) {
        console.log(`сохранение не работает: ${e} `);
        return res.send({
          message: `сохранение не работает: ${e} `,
          status: "400",
        });
      }
    } catch (e) {
      console.log(`Ошибка создания карточки: ${e} `);
      return res.send({
        message: `Ошибка создания карточки: ${e} `,
        status: "400",
      });
    }
  } catch (err) {
    return res.send({ error: err });
  }
});

app.post(`/lifts`, async function (req, res) {
  let lifts = await LiftModel.findAll();
  res.send({ lifts });
});

app.post(`/delete_lift`, async function (req, res) {
  try {
    let id = req.body.id;
    let liftDelete = await LiftModel.findOne({ where: { id: id } });
    console.log(liftDelete, id);
    await liftDelete.destroy();
    res.json({ message: "Удаление прошло успешно", status: 200 });
  } catch (err) {
    res.json({ message: "Ошибка удаления подъёмника", err });
  }
});

app.post(`/skipass`, async function (req, res) {
  try {
    let skipass = await SkipassModel.findAll();
    res.send({ skipass });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/find_skipass`, async function (req, res) {
  try {
    let id = req.body.id;
    let skipass = await SkipassModel.findOne({ where: { id } });
    res.send({ skipass });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/edit_skipass`, async function (req, res) {
  try {
    let { title, content, price, id } = req.body;
    let skipass = await SkipassModel.findOne({ where: { id } });
    skipass.title = title;
    skipass.content = content;
    skipass.price = price;
    await skipass.save();
    res.send({ success: true, message: "Успешно" });
  } catch (err) {
    res.send({ success: false, message: "Ошибка сохранения" });
    console.log(err);
  }
});

app.post(`/create_skipass`, async function (req, res) {
  try {
    let { title, content, price } = req.body;
    let skipass = await SkipassModel.create({
      title,
      content,
      price,
    });
    await skipass.save();
    return res.send({
      message: "Ски-пасс успешно создан",
      success: true,
      status: 200,
    });
  } catch (err) {
    res.send({
      message: "Ошибка создания ски-пасса",
      success: false,
      err,
      status: 400,
    });
  }
});

app.post(`/delete_skipass`, async function (req, res) {
  try {
    let id = req.body.id;
    let skipass = await SkipassModel.findOne({ where: { id: id } });
    await skipass.destroy();
    res.send({
      message: "Удаление прошло успешно",
      status: 200,
      success: true,
    });
  } catch (err) {
    res.send({ message: "Ошибка удаления ски-пасса", err, success: false });
  }
});

app.post(`/payment`, async function (req, res) {
  try {
    let { price, name, id, userID } = req.body;
    let transfer = await CardTransfer.findOne({ where: { id: id } });
    let user = await UserModel.findOne({ where: { id: userID } })
    let { paymentRef, payment } = await initPayment(price, name);
    awaitPayment(payment).then(async (result) => {
      if (result) {
        transfer.passenger -= 1;
        await transfer.save();
        user.balance += price * 0.9
      }
    });

    res.send({ paymentRef, success: true });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/send_mail`, async function (req, res) {
  try {
    let { email, phone, fromdate, todate } = req.body;
    let transporter = nodemailer.createTransport({
      host: "smtp.beget.com",
      port: 2525,
      secure: false,
      auth: {
        user: "codered-it@coderedit.site",
        pass: "Stas_2001",
      },
    });

    let mailOptions = {
      from: "<codered-it@coderedit.site>",
      to: email,
      subject: "Бронирование",
      text: "Прошло бронирование",
      html: `Прошло бронирование на сайте http://sneg-info.ru по вашему объявлению.<br>Номер клиента: ${phone}.<br>С <b>${fromdate}</b> по <b>${todate}</b>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    });
    res.send({ status: 200, success: true });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/send_tg`, async function (req, res) {
  try {
    let { phone, chatID, fromdate, todate } = req.body;
    bot.sendMessage(
      chatID,
      `Прошло бронирование на сайте http://sneg-info.ru по вашему объявлению. Номер клиента: ${phone}. С "${fromdate}" по "${todate}"`
    );
    res.send({ status: 200, success: true });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/admin_requests`, async function (req, res) {
  try {
    let { nameModel, category } = req.body;
    let requests = [];
    if (category == "habitation") {
      requests = await HotelModel.findAll({
        where: { verified: false, subcategory: nameModel },
      });
    } else if (nameModel == "transfer") {
      requests = await CardTransfer.findAll({ where: { verified: false } });
    } else if (nameModel == "service") {
      requests = await CardService.findAll({ where: { verified: false } });
    } else {
      requests = await CardModel.findAll({
        where: { category: category, subcategory: nameModel, verified: false },
      });
    }
    res.send({ requests });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/accept_request`, async function (req, res) {
  try {
    let { id, nameModel } = req.body;
    let card;
    console.log(id, nameModel);
    if (
      nameModel == "hotels" ||
      nameModel == "cottage" ||
      nameModel == "rooms"
    ) {
      card = await HotelModel.findOne({ where: { id: id } });
    } else if (nameModel == "transfer") {
      card = await CardTransfer.findOne({ where: { id: id } });
    } else if (nameModel == "service") {
      card = await CardService.findOne({ where: { id: id } });
    } else {
      card = await CardModel.findOne({ where: { id: id } });
    }
    console.log(card);
    card.verified = true;
    await card.save();
    res.send({
      message: "Принято",
      status: 200,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.send({ message: "Ошибка создания запроса", err, success: false });
  }
});

app.post(`/reject_request`, async function (req, res) {
  try {
    let { id, nameModel } = req.body;
    let card;
    console.log(id, nameModel);
    if (nameModel == "hotels") {
      card = await HotelModel.findOne({ where: { id: id } });
    } else if (nameModel == "transfer") {
      card = await CardTransfer.findOne({ where: { id: id } });
    } else if (nameModel == "service") {
      card = await CardService.findOne({ where: { id: id } });
    } else {
      card = await CardModel.findOne({ where: { id: id } });
    }
    await card.destroy();
    res.send({
      message: "Удаление прошло успешно",
      status: 200,
      success: true,
    });
  } catch (err) {
    res.send({ message: "Ошибка удаления запроса", err, success: false });
  }
});
app.get(`/check`, async function (req, res) {
  let admin = false;
  let token = req.headers.authorization;
  console.log(token);
  let { role: userRoles } = jwt.verify(token, secret);
  console.log(userRoles);

  if (token) {
    userRoles.forEach((role) => {
      if (role == "ADMIN") {
        admin = true;
      }
    });
  }
  return res.send({ admin });
});

app.post(`/check_admin`, async function (req, res) {
  try {
    let { id } = req.body;
    let admin = false;
    let user;
    if (id) {
      user = await UserModel.findOne({ where: { id } });
      if (user.role == "ADMIN") {
        admin = true;
      }
    }
    res.send({ admin });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/notifications`, async function (req, res) {
  try {
    let { nameModel, category } = req.body;
    if (nameModel == "reqAll") {
      let transfer = await CardTransfer.findAll({ where: { verified: false } });
      let service = await CardService.findAll({ where: { verified: false } });
      let cards = await CardModel.findAll({ where: { verified: false } });
      let habitation = await HotelModel.findAll({
        where: {
          verified: false,
        },
      });
      let payments = await RequestPaymentModel.findAll({ where: { done: false } })

      let s =
        transfer.length + service.length + cards.length + habitation.length + payments.length;
      res.send({ s });
    }
    if (nameModel == "all") {
      let transfer = await CardTransfer.findAll({ where: { verified: false } });
      let service = await CardService.findAll({ where: { verified: false } });
      if (transfer) {
        transfer = transfer.length + service.length;
      }

      let habitation = await HotelModel.findAll({
        where: {
          verified: false,
        },
      });
      if (habitation) {
        habitation = habitation.length;
      }

      let rental = await CardModel.findAll({
        where: {
          category: "rental",
          verified: false,
        },
      });
      if (rental) {
        rental = rental.length;
      }

      let forChildren = await CardModel.findAll({
        where: {
          category: "forChildren",
          verified: false,
        },
      });
      if (forChildren) {
        forChildren = forChildren.length;
      }

      let instructorTours = await CardModel.findAll({
        where: { category: "instructorTours", verified: false },
      });
      if (instructorTours) {
        instructorTours = instructorTours.length;
      }

      let events = await CardModel.findAll({
        where: { category: "event", verified: false },
      });
      if (events) {
        events = events.length;
      }

      let payments = await RequestPaymentModel.findAll({ where: { done: false } })
      if (payments) {
        payments = payments.length
      }

      res.send({
        transfer: transfer,
        habitation: habitation,
        rental: rental,
        forChildren: forChildren,
        instructorTours: instructorTours,
        events: events,
        payments: payments
      });
    } else if (nameModel == "habitation") {
      let hotel = await HotelModel.findAll({
        where: { verified: false, subcategory: "hotels" },
      });
      if (hotel) {
        hotel = hotel.length;
      }

      let cottage = await HotelModel.findAll({
        where: { subcategory: "cottage", verified: false },
      });
      if (cottage) {
        cottage = cottage.length;
      }

      let flat = await HotelModel.findAll({
        where: { subcategory: "flat", verified: false },
      });
      if (flat) {
        flat = flat.length;
      }

      let room = await HotelModel.findAll({
        where: { subcategory: "rooms", verified: false },
      });
      if (room) {
        room = room.length;
      }

      let hostel = await HotelModel.findAll({
        where: { subcategory: "hostel", verified: false },
      });
      if (hostel) {
        hostel = hostel.length;
      }

      let longterm = await HotelModel.findAll({
        where: { subcategory: "longterm" },
      });
      if (longterm) {
        longterm = longterm.length;
      }

      res.send({ hotel, cottage, flat, room, hostel, longterm });
    } else if (nameModel == "forChildren") {
      let childrenRooms = await CardModel.findAll({
        where: { subcategory: "childrenRooms", verified: false },
      });
      if (childrenRooms) {
        childrenRooms = childrenRooms.length;
      }

      let nanny = await CardModel.findAll({
        where: { subcategory: "nanny", verified: false },
      });
      if (nanny) {
        nanny = nanny.length;
      }

      let otherEntertainment = await CardModel.findAll({
        where: { subcategory: "otherEntertainment", verified: false },
      });
      if (otherEntertainment) {
        otherEntertainment = otherEntertainment.length;
      }

      let instructor = await CardModel.findAll({
        where: { subcategory: "instructor", verified: false },
      });
      if (instructor) {
        instructor = instructor.length;
      }

      res.send({ childrenRooms, nanny, otherEntertainment, instructor });
    } else if (nameModel == "event") {
      let bans = await CardModel.findAll({
        where: { subcategory: "bans", verified: false },
      });
      if (bans) {
        bans = bans.length;
      }

      let massage = await CardModel.findAll({
        where: { subcategory: "massage", verified: false },
      });
      if (massage) {
        massage = massage.length;
      }

      let restaurants = await CardModel.findAll({
        where: { subcategory: "restaurants", verified: false },
      });
      if (restaurants) {
        restaurants = restaurants.length;
      }

      let nightClubs = await CardModel.findAll({
        where: { subcategory: "nightClubs", verified: false },
      });
      if (nightClubs) {
        nightClubs = nightClubs.length;
      }

      let hoofing = await CardModel.findAll({
        where: { subcategory: "hoofing", verified: false },
      });
      if (hoofing) {
        hoofing = hoofing.length;
      }

      let karaoke = await CardModel.findAll({
        where: { subcategory: "karaoke", verified: false },
      });
      if (karaoke) {
        karaoke = karaoke.length;
      }

      let ratrak = await CardModel.findAll({
        where: { subcategory: "ratrak", verified: false },
      });
      if (ratrak) {
        ratrak = ratrak.length;
      }

      let helicopter = await CardModel.findAll({
        where: { subcategory: "helicopter", verified: false },
      });
      if (helicopter) {
        helicopter = helicopter.length;
      }

      let zoos = await CardModel.findAll({
        where: { subcategory: "zoos", verified: false },
      });
      if (zoos) {
        zoos = zoos.length;
      }

      res.send({
        bans,
        massage,
        restaurants,
        nightClubs,
        hoofing,
        karaoke,
        ratrak,
        helicopter,
        zoos,
      });
    } else if (nameModel == "rental") {
      let inventory = await CardModel.findAll({
        where: { subcategory: "inventory", verified: false },
      });
      if (inventory) {
        inventory = inventory.length;
      }

      let hookah = await CardModel.findAll({
        where: { subcategory: "hookah", verified: false },
      });
      if (hookah) {
        hookah = hookah.length;
      }

      let transport = await CardModel.findAll({
        where: { subcategory: "transport", verified: false },
      });
      if (transport) {
        transport = transport.length;
      }

      let other = await CardModel.findAll({
        where: { subcategory: "other", verified: false },
      });
      if (other) {
        other = other.length;
      }

      res.send({ inventory, hookah, transport, other });
    } else if (nameModel == "instructorTours") {
      let instructorAdults = await CardModel.findAll({
        where: { subcategory: "instructorAdults", verified: false },
      });
      if (instructorAdults) {
        instructorAdults = instructorAdults.length;
      }

      let instructorChildren = await CardModel.findAll({
        where: { subcategory: "instructorChildren", verified: false },
      });
      if (instructorChildren) {
        instructorChildren = instructorChildren.length;
      }

      let winterTours = await CardModel.findAll({
        where: { subcategory: "winterTours", verified: false },
      });
      if (winterTours) {
        winterTours = winterTours.length;
      }

      let summerTours = await CardModel.findAll({
        where: { subcategory: "summerTours", verified: false },
      });
      if (summerTours) {
        summerTours = summerTours.length;
      }

      res.send({
        instructorAdults,
        instructorChildren,
        winterTours,
        summerTours,
      });
    } else {
      let cards;
      let transfers = await CardTransfer.findAll({
        where: { verified: false },
      });
      if (transfers) {
        transfers = transfers.length;
      }
      let services = await CardService.findAll({ where: { verified: false } });
      if (services) {
        services = services.length;
      }
      let hotels = await HotelModel.findAll({ where: { verified: false } });
      if (hotels) {
        hotels = hotels.length;
      }
      if (category && nameModel) {
        cards = await CardModel.findAll({
          where: {
            verified: false,
            category: category,
            subcategory: nameModel,
          },
        });
        if (cards) {
          cards = cards.length;
        }
      }

      res.send({ transfers, services, hotels, cards });
    }
  } catch (err) {}
});

app.post(`/profile`, async function (req, res) {
  try {
    let { id } = req.body;
    let user;
    if (id) {
      user = await UserModel.findOne({ where: { id } });
    }
    res.send({ user });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/myads`, async function (req, res) {
  try {
    let { id } = req.body;
    let cards = [];
    let hotels = [];
    let transfers = [];
    let services = [];
    if (id) {
      cards = await CardModel.findAll({
        where: { userID: id, verified: true },
      });
      hotels = await HotelModel.findAll({
        where: { userID: id, verified: true },
      });
      transfers = await CardTransfer.findAll({
        where: { userID: id, verified: true },
      });
      services = await CardService.findAll({
        where: { userID: id, verified: true },
      });
    }
    res.send({ cards, hotels, transfers, services });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/transfer_days`, async function(req, res) {
  try {
    let { month, cityfrom, cityto } = req.body
    if (cityfrom && cityto) {
      let transfers = await CardTransfer.findAll({ where: { cityfrom, cityto } })
      let days = []
      for (let i = 0; i < transfers.length; i++) {
        let transfer = transfers[i]
        if (month.includes(transfer.datefrom) && transfer.passenger > 0) {
          days.push(transfer)
        }
      }
      days.sort((a, b) => new Date(a.datefrom) - new Date(b.datefrom));
      res.send({ days })
    } else {
      let transfers = await CardTransfer.findAll()
      let days = []
      for (let i = 0; i < transfers.length; i++) {
        let transfer = transfers[i]
        if (month.includes(transfer.datefrom) && transfer.passenger > 0) {
          days.push(transfer)
        }
      }
      days.sort((a, b) => new Date(a.datefrom) - new Date(b.datefrom));
      res.send({ days })
    }
  } catch(err) {
    console.log(err)
  }
})

app.post(`/confirmation`, async function(req, res) {
  try {
    let { phone, codeInput } = req.body
    let code
    let number = phone.slice(1)
    console.log(number, codeInput)
    if (codeInput) {
      console.log(codeInput)
      if (codeInput == code) {
        res.send({ verified: true })
      } else {
        res.send({ verified: false })
      }
    } else {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const api_id = 'F2117CBA-89E3-7C23-1C4F-61E1F9338C54'
      let success
      console.log(ip, api_id)
      let response = await axios.post('https://sms.ru/code/call', {
        phone: number,
        ip: ip,
        api_id: api_id
      })
      console.log(response.data)
      if (response.data) {
        code = response.data.code
        success = response.data.success
      } else {
        success = false
      }
      res.send({ success })
    }
  } catch(err) {
    console.log(err)
  }
})

app.post(`/request_payments`, async function(req, res) {
  try {
    let { userID } = req.body
    if (userID) {
      let user = await UserModel.findOne({ id: userID })
      if (user) {
        res.send({ balance: user.balance })
      }
    } else {
      let requests = await RequestPaymentModel.findAll({ done: false })
      res.send({ requests })
    }
  } catch(err) {
    console.log(err)
  }
})

app.post(`/request_payment`, async function(req, res) {
  try {
    let { userID, amount, card_number } = req.body
    if (userID && amount && card_number) {
      let user = await UserModel.findOne({ id: userID })
      let request = await RequestPaymentModel.create({
        username: user.username,
        surname: user.surname,
        userID: userID,
        amount: amount,
        card_number: card_number,
        phone: user.phone,
        done: false
      })
      await request.save()
      res.send({ success: true, status: 200, message: 'Запрос на вывод успешно создан, ожидайте' })
    } else {
      res.send({ success: false, status: 400, message: 'Недостаточно данных!' })
    }
  } catch(err) {
    console.log(err)
  }
})

app.post(`/accept_payments`, async function(req, res) {
  try {
    let { id } = req.body
    let request = await RequestPaymentModel.findOne({ id })
    let user = await UserModel.findOne({ id: request.userID })
    if (user.balance >= request.amount) {
      user.balance -= request.amount
      request.done = true
      await user.save()
      await request.save()
      res.send({ message: '', success: true })
    } else {
      res.send({ message: 'Сумма вывода превышает баланс пользователя!' })
    }
  } catch(err) {
    console.log(err)
  }
})

app.post(`/reject_payments`, async function(req, res) {
  try {
    let { id } = req.body
    let request = await RequestPaymentModel.findOne({ id })
    await request.destroy()
    res.send({ success: true })
  } catch(err) {
    console.log(err)
  }
})