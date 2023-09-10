let express = require(`express`);
let app = express();
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const { secret } = require(`./config`);

let port = 3005;

app.listen(port, function () {
  console.log(`http://localhost:${port}`);
});

let cors = require('cors');
app.use(cors({ origin: 'http://31.172.67.138/' }));

// Подключаем middleware для сессий
app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// Раздача статики
app.use(express.static(`public`));

// Настройка POST-запроса — JSON
app.use(express.json());
app.use(fileUpload());
// Настройка POST-запроса
app.use(express.urlencoded({ extended: true }));

let mongoose = require(`mongoose`);
mongoose.connect(`mongodb://127.0.0.1:27017/estate`);


let newsSchema = mongoose.Schema(
  {
    title: String,
    content: String,
  },
  {
    timestamps: {
      createdAt: true,
    },
  }
);

let News = new mongoose.model(`news`, newsSchema);

let habinationShema = mongoose.Schema({
  title: String,
  img: Array,
  p: String,
  price: Number,
  phone: Number,
  adress: String,
  nameCard: String,
});
let Habinations = new mongoose.model(`habitation`, habinationShema);

let eventsShema = mongoose.Schema({
 title: String,
  img: Array,
  p: String,
  price: Number,
  phone: Number,
  adress: String,
  nameCard: String,
});
let Events = new mongoose.model(`event`, eventsShema);

let rentalShema = mongoose.Schema({
 title: String,
  img: Array,
  p: String,
  price: Number,
  phone: Number,
  adress: String,
  nameCard: String,
});
let Rental = new mongoose.model(`rental`, rentalShema);

let forChildrenShema = mongoose.Schema({
 title: String,
  img: Array,
  p: String,
  price: Number,
  phone: Number,
  adress: String,
  nameCard: String,
});
let ForChildren = new mongoose.model(`forChildren`, forChildrenShema);

let instructorToursShema = mongoose.Schema({
  title: String,
  img: Array,
  p: String,
  price: Number,
  phone: Number,
  adress: String,
  nameCard: String,
});
let InstructorTours = new mongoose.model(
  `instructorTour`,
  instructorToursShema
);
let RoleShema = mongoose.Schema({
  value: {
    type: String,
    unique: true,
    default: 'USER',
  },
});
let Role = new mongoose.model(`role`, RoleShema);

let UserShema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  roles: [
    {
      type: String,
      ref: 'Role',
    },
  ],
});
let User = new mongoose.model(`user`, UserShema);

let generateAccessToken = (id, roles) => {
  let payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: '336h' });
};

let verifyc = function (roles) {
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
      let { roles: userRoles } = jwt.verify(token, secret);
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return res.json({ message: 'У вас нет доступа' });
      }
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
      let { roles: userRoles } = jwt.verify(token, secret);
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

app.get(`/news`, async function (req, res) {
  let token = req.headers.authorization;
  let { roles: userRoles } = jwt.verify(token, secret);
  let admin
  if (token) {
    userRoles.forEach((role) => {
      if (role == 'ADMIN') {
        admin = true;
      }
    });
  }

  let news = await News.find({});

  res.send({ news, admin });
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
    let card = await Habinations.findOne({ _id: timeId });
    card.img.push(file.name);
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
    let card;
    if (name == `habitation`) {
      card = await Habinations.findOne({ _id: id });
    }
    if (name == `event`) {
      card = await Events.findOne({ _id: id });
    }
    if (name == `rental`) {
      card = await Rental.findOne({ _id: id });
    }
    if (name == `forChildren`) {
      card = await ForChildren.findOne({ _id: id });
    }
    if (name == `instructor-tours`) {
      card = await InstructorTours.findOne({ _id: id });
    }
    card.img = imgName;
    await card.save();
    return res.send({ message: 'Успешно', status: '200' });
  }
  let card = await Habinations.findOne({ _id: timeId });
  card.img = imgName;
  console.log(card);
  await card.save();
  return res.send({ message: 'Успешно', status: '200' });
});
app.post(`/create-card`, async function (req, res) {
  try {
    let { title, price, p, nameCard, edit, name, id, phone, adress, img } =
      req.body;
    if (edit) {
      let card;
      if (name == `habitation`) {
        card = await Habinations.findOne({ _id: id });
      }
      if (name == `event`) {
        card = await Events.findOne({ _id: id });
      }
      if (name == `rental`) {
        card = await Rental.findOne({ _id: id });
      }
      if (name == `forChildren`) {
        card = await ForChildren.findOne({ _id: id });
      }
      if (name == `instructor-tours`) {
        card = await InstructorTours.findOne({ _id: id });
      }
      card.title = title;
      card.price = price;
      card.p = p;
      card.adress = adress;
      card.phone = phone;
      card.img = img;
      await card.save();
      console.log(card);
      return res.json({ status: '200' });
    }
    let card = new Habinations({
      title,
      price,
      p,
      nameCard,
      phone,
      adress,
    });
    timeId = card._id;
    await card.save();
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
    let candidate = await User.findOne({ username, surname });
    let candidateEmail = await User.findOne({ email });
    let candidatePhone = await User.findOne({ number });
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
    if (candidate) {
      return res.json({
        message: 'Пользователь с таким именем уже существует',
        status: '400',
      });
    }
    let hashPassword = bcrypt.hashSync(password, 7);
    let userRole = await Role.findOne({ value: 'USER' });
    let user = new User({
      username,
      surname,
      email,
      number,
      password: hashPassword,
      roles: [userRole.value],
    });
    await user.save();
    return res.json({
      message: 'Пользователь успешно зарегистрирован',
      status: '200',
    });
  } catch (err) {
    res.json({ message: 'Registration error' });
  }
});
app.post(`/login`, async function (req, res) {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
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
    let token = generateAccessToken(user._id, user.roles);
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
  let { roles: userRoles } = jwt.verify(token, secret);
  console.log(userRoles);

  if (token) {
    userRoles.forEach((role) => {
      if (role == 'ADMIN') {
        admin = true;
      }
    });
  }
  if (name == `habitation`) {
    card = await Habinations.findOne({ _id: id });
  }
  if (name == `event`) {
    card = await Events.findOne({ _id: id });
  }
  if (name == `rental`) {
    card = await Rental.findOne({ _id: id });
  }
  if (name == `forChildren`) {
    card = await ForChildren.findOne({ _id: id });
  }
  if (name == `instructor-tours`) {
    card = await InstructorTours.findOne({ _id: id });
  }

  res.send({ card, admin });
});

app.get(`/instructor-tours/items`, async function (req, res) {
  try {
    let name = req.query.name;
    let cards;
    let admin = false;
    let token = req.headers.authorization;
    console.log(token);
    let { roles: userRoles } = jwt.verify(token, secret);
    console.log(userRoles);

    if (name) {
      cards = await InstructorTours.find({ nameCard: name });
      if (token) {
        userRoles.forEach((role) => {
          if (role == 'ADMIN') {
            admin = true;
          }
        });
      }
    } else {
      cards = await InstructorTours.find({});
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
    let { roles: userRoles } = jwt.verify(token, secret);
    console.log(userRoles);

    if (name) {
      cards = await ForChildren.find({ nameCard: name });
      if (token) {
        userRoles.forEach((role) => {
          if (role == 'ADMIN') {
            admin = true;
          }
        });
      }
    } else {
      cards = await ForChildren.find({});
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
    let { roles: userRoles } = jwt.verify(token, secret);
    console.log(userRoles);

    if (name) {
      cards = await Rental.find({ nameCard: name });
      if (token) {
        userRoles.forEach((role) => {
          if (role == 'ADMIN') {
            admin = true;
          }
        });
      }
    } else {
      cards = await Rental.find({});
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
    let { roles: userRoles } = jwt.verify(token, secret);
    console.log(userRoles);

    if (name) {
      cards = await Events.find({ nameCard: name });
      if (token) {
        userRoles.forEach((role) => {
          if (role == 'ADMIN') {
            admin = true;
          }
        });
      }
    } else {
      cards = await Events.find({});
    }
    res.send({ cards, admin });
  } catch (e) {
    res.send({ expired: true });
  }
});

app.get(`/habitation/items`, async function (req, res) {
  try {
    let name = req.query.name;
    let cards;
    let admin = false;
    let token = req.headers.authorization;
    console.log(token);
    let { roles: userRoles } = jwt.verify(token, secret);
    console.log(userRoles);

    if (name) {
      cards = await Habinations.find({ nameCard: name });
      if (token) {
        userRoles.forEach((role) => {
          if (role == 'ADMIN') {
            admin = true;
          }
        });
      }
    } else {
      cards = await Habinations.find({});
    }
    res.send({ cards, admin });
  } catch (e) {
    res.send({ expired: true });
  }
});

app.get(`/create_roles`, async function(req, res) {
  let user = new Role({value: 'USER'})
  await user.save()
  let admin = new Role({value: 'ADMIN'})
  await admin.save()
  res.redirect(`back`)
})