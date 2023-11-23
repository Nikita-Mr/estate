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
  RequestsModel,
} = require("./modules/models");
const { secret } = require(`./config`);

const { tryBook, addNumber } = require(`./modules/booking`);

const { initPayment, awaitPayment } = require(`./modules/payments`);

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

let generateAccessToken = (id, role) =>
  jwt.sign({ id, role }, secret, { expiresIn: "336h" });

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

app.get("/", async function (req, res) {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});
//app.use(fallback(path.join(__dirname, 'dist/index.html')))

app.get("/newsDebug", async function (req, res) {
  console.log(UserModel);
  let news = await UserModel.findAll();

  res.send({ news });
});

app.get(`/filter`, async function (req, res) {
  let { namefilter, cityfrom, cityto, datefrom, passenger } = req.query;
  let token = req.headers.authorization;
  let { role: userRoles } = jwt.verify(token, secret);
  let admin;
  if (token) {
    userRoles.forEach((role) => {
      if (role == "ADMIN") admin = true;
    });
  }
  let filter;
  let Array = [];
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
    res.send({ message: "В это время поездок нет" });
    return;
  }
  res.send({ Array, admin });
});

app.get(`/transfer`, async function (req, res) {
  try {
    let token = req.headers.authorization;
    let { id, book } = req.query;
    let { role: userRoles } = jwt.verify(token, secret);
    let admin;
    if (token) {
      userRoles.forEach((role) => {
        if (role == "ADMIN") admin = true;
      });
    }
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

app.get(`/news`, async function (req, res) {
  let token = req.headers.authorization;
  let { role: userRoles } = jwt.verify(token, secret);
  let admin;
  if (token) {
    userRoles.forEach((role) => {
      if (role == "ADMIN") admin = true;
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

    res.send({ cards, admin });
  } catch (e) {
    console.log(e);
    res.send({ expired: true });
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
          nameCard: "undef",
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
          nameCard: "undef",
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
    let token = generateAccessToken(user._id, [user.role]);
    return res.json({ token, message: "Вошел", status: 200 });
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
app.get(`/card`, async function (req, res) {
  try {
    let { id, name, view } = req.query;
    let card;
    let number;
    let admin = false;
    let token = req.headers.authorization;
    let { role: userRoles } = jwt.verify(token, secret);

    if (token) {
      userRoles.forEach((role) => {
        if (role == "ADMIN") {
          admin = true;
        }
      });
    }
    if (name == `habitation`) {
      if (view) {
        card = await HotelModel.findOne({ where: { id: id } });
        number = await NumberModel.findAll({ where: { HotelModelId: id } });
      } else {
        card = await HotelModel.findOne({ where: { id: id, verified: true } });
        number = await NumberModel.findAll({ where: { HotelModelId: id } });
      }
    } else {
      card = await CardModel.findOne({ where: { id: id, verified: true } });
    }
    res.send({ card, admin, number, view });
  } catch (err) {
    console.log(err);
  }
});

app.get(`/instructor-tours`, async function (req, res) {
  try {
    let { name, category } = req.query;
    console.log(name, category);
    let cards;
    let admin = false;
    let token = req.headers.authorization;
    let { role: userRoles } = jwt.verify(token, secret);

    if (name) {
      cards = await CardModel.findAll({
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
    res.send({ cards, admin });
  } catch (e) {
    res.send({ expired: true });
  }
});
app.get(`/ads`, async function (req, res) {
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
    res.send({ cards, admin });
  } catch (e) {
    res.send({ expired: true });
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
      cityfrom,
      cityto,
      datefrom,
      dateto,
      timefrom,
      timeto,
      car,
      typeCar,
      passenger,
      price,
    } = req.body;
    let transfer = await CardTransfer.create({
      name: name,
      cityfrom: cityfrom,
      cityto: cityto,
      datefrom: datefrom,
      dateto: dateto,
      timefrom: timefrom,
      timeto: timeto,
      car: car,
      typeCar: typeCar,
      passenger: passenger,
      price: price,
      verified: false,
    });
    await transfer.save();
    return res.send({
      message: "Трансфер успешно создан",
      show: true,
      status: "200",
    });
  } catch (err) {
    res.send({ message: "Ошибка создания трансфера", show: false, err });
  }
});

app.post(`/create_service`, async function (req, res) {
  try {
    let { name, phone, description } = req.body;
    try {
      console.log("building card...");
      let card = await CardService.build({
        img: {},
        name: name,
        phone: phone,
        description: description,
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
  } catch (err) {
    res.send({ message: "Ошибка создания услуги", show: false, err });
  }
});

app.get(`/services`, async function (req, res) {
  let services = await CardService.findAll();
  res.send({ services });
});

app.get(`/service-card`, async function (req, res) {
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
app.get(`/number`, async function (req, res) {
  try {
    let { id } = req.query;
    let number = await NumberModel.findAll({ where: { HotelModelId: id } });
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

app.get(`/check_admin`, async function (req, res) {
  try {
    let token = req.headers.authorization;
    let { role: userRoles } = jwt.verify(token, secret);
    let admin;
    if (token) {
      userRoles.forEach((role) => {
        if (role == "ADMIN") admin = true;
      });
    }
    res.send({ admin });
  } catch (err) {
    console.log(err);
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
    let { price, name } = req.body;
    let { paymentRef, payment } = await initPayment(price, name);
    awaitPayment(payment);
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

app.post(`/admin_requests`, async function (req, res) {
  try {
    let { nameModel, category } = req.body;
    let requests = [];
    if (nameModel == "hotels") {
      requests = await HotelModel.findAll({ where: { verified: false } });
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
    if (nameModel == "hotels") {
      card = await HotelModel.findOne({ where: { id: id } });
    } else if (nameModel == "transfer") {
      card = await CardTransfer.findOne({ where: { id: id } });
    } else if (nameModel == "service") {
      card = await CardService.findOne({ where: { id: id } });
    } else {
      card = await CardModel.findOne({ where: { id: id } });
    }
    card.verified = true;
    await card.save();
    res.send({
      message: "Принято",
      status: 200,
      success: true,
    });
  } catch (err) {
    res.send({ message: "Ошибка создания запроса", err, success: false });
  }
});

app.post(`/reject_request`, async function (req, res) {
  try {
    let { id, nameModel } = req.body;
    let card;
    if (nameModel == "hotel") {
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
