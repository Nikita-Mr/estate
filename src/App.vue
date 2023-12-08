<script>
import { RouterLink, RouterView } from 'vue-router';
import AppNav from './components/AppNav.vue';
import AppSlider from './components/AppSlider.vue';
import AppCenter from './components/AppCenter.vue';
import AppPhone from './components/AppPhone.vue';
import AppAdmin from './views/admin/AppAdmin.vue';
import axios from 'axios';
import router from './router/router';
import { name } from 'dayjs/locale/ru';
// axios.defaults.headers.common['Authorization'] = document.cookie.replace("token=", ``).split(`;`, 1)

export default {
  components: {
    AppNav,
    AppSlider,
    AppCenter,
    AppPhone,
    AppAdmin,
  },
  data() {
    return {
      name: {
        '/': 'Главная',
        '/search': 'Поиск',
        home: 'Главная',
        weather: 'Погода',
        book_a_seat: 'Бронирование места',
        book_a_transfer: 'Бронирование трансфера',
        search: 'Поиск',
        register: 'Регистрация',
        login: 'Вход',
        info: 'Информация',
        'transfer-taksi': 'Трансфер такси',
        habitation: 'Проживание',
        habitationItems: 'Карточки проживания',
        rental: 'Прокат',
        rentalItems: 'Карточки проката',
        event: 'Развлечения',
        eventItems: 'Карточки развлечения',
        forChildren: 'Для детей',
        forChildrenItems: 'Карточки для детей',
        'instructor-tours': 'Инструктор/Туры',
        instructorToursItems: 'Карточки инструктор/туры',
        news: 'Новости',
        ads: 'Объявления',
        adsItems: 'Карточки объявления',
        transfer: 'Трансфер',
        'taxi-delivery': 'Такси-доставка',
        serviceCardOpen: 'Карточки такси-доставки',
        card: 'Карточка',
        createCard: 'Создание карточки',
        createNews: 'Создание новостей',
        createTransfer: 'Создание трансферов',
        createService: 'Создание услуг',
        transfercard: 'Карточка трансфера',
        lift: 'Подъемники',
        appcreatelift: 'Создание Подъемников',
        appcameras: 'Камеры',
        appmap: 'Карта',
        appemergency: 'Экстренные службы',
        skipass: 'СКИ-пасы',
        skipasscreate: 'Создание СКИ-пасов',
        adminreq: 'ADMIN Запросы',
        adminsections: 'ADMIN панель',
        adminevents: 'ADMIN развлечения',
        adminforchildren: 'ADMIN для детей',
        adminhabitation: 'ADMIN проживание',
        admininstructortours: 'ADMIN инструкторы/туры',
        adminrental: 'ADMIN прокаты',
        admintransfertaksi: 'ADMIN трансфер такси',
        adminads: 'ADMIN объявления',
      },
      admin: false,
    };
  },
  watch() {
    this.reload();
  },
  methods: {
    reload() {
      window.location.assign(`http://localhost:5173`);
      Vue.config.silent = true;
    },
    async notifications() {
      let response = await axios.get(`/check`, {
        headers: {
          Authorization: document.cookie.replace('token=', ``),
        },
      });

      this.admin = response.data.admin;
    },
    namepage(el) {
      console.log(this.name[el]);
      return this.name[el];
    },
  },
  mounted() {
    // this.notifications();
  },
};
</script>

<template>
  <app-nav></app-nav>
  <app-slider></app-slider>
  <div class="site-page">
    <span>{{ namepage($route.name) }}</span>
  </div>
  <app-center></app-center>
  <div class="wrapperBottom">
    <app-admin > </app-admin>
    <app-phone></app-phone>
  </div>
</template>

<style>
.site-page {
  color: var(--mainColor);
  font-size: clamp(18px, 5vw, 30px);
  margin: 0 0 0 20px;
  
}
.wrapper-main{
  height: 75vh !important;
}
.appAdmin {
  position: relative;
}
.alert {
  position: absolute;
  top: 5%;
  right: 3%;
  padding: 2px;
  color: red;
  border: 1px solid red;
  border-radius: 100%;
  height: 25px;
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: #ffffff !important;
  transition: background-color 5000s ease-in-out 0s !important;
  box-shadow: inset 0 0 20px 20px #23232300 !important;
}

.wrapperBottom {
  position: absolute;
  width: 400px;
  bottom: 20px;
  right: 0;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 10px;
}
@media (max-width: 400px) {
  .wrapperBottom {
    width: 100%;
  }
}

/* input{
  color: #ffffff !important; 
} */
</style>
