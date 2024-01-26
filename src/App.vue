<script>
import { RouterLink, RouterView } from 'vue-router';
import AppNav from './components/AppNav.vue';
import AppSlider from './components/AppSlider.vue';
import AppCenter from './components/AppCenter.vue';
import AppPhone from './components/AppPhone.vue';
import AppAdmin from './components/AppAdmin.vue';
import axios from 'axios';
import router from './router/router';
import { name } from 'dayjs/locale/ru';

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
        home: 'Главная',
        weather: 'Погода',
        book_a_seat: 'Бронирование места',
        book_a_transfer: 'Бронирование трансфера',
        register: 'Регистрация',
        login: 'Вход',
        profile: 'Профиль',
        myads: 'Мои объявления',
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
        adsItems: 'Объявления',
        transfer: 'Трансфер',
        'taxi-delivery': 'Такси-доставка',
        serviceCardOpen: 'Такси-доставка',
        card: 'Объект',
        createCard: 'Создание объекта',
        createNews: 'Создание новости',
        createTransfer: 'Создание трансфера',
        createService: 'Создание услуги',
        transfercard: 'Трансфер',
        lift: 'Подъемники',
        appcreatelift: 'Создание Подъемников',
        appcameras: 'Камеры',
        appmap: 'Карта',
        appemergency: 'Экстренные службы',
        skipass: 'График работы и стоимость подъёмников',
        skipasscreate: 'Создание СКИ-пасов',
        adminreq: 'ADMIN Запросы',
        adminsections: 'Запросы',
        adminevents: 'ADMIN развлечения',
        adminforchildren: 'ADMIN для детей',
        adminhabitation: 'ADMIN проживание',
        admininstructortours: 'ADMIN инструкторы/туры',
        adminrental: 'ADMIN прокаты',
        admintransfertaksi: 'ADMIN трансфер/такси',
        adminads: 'ADMIN объявления',
        phonepolicy: 'Политика',
        reqpayments: 'Запросы на вывод средств',
        withdrawal: 'Форма вывода'
      },
      id: '',
      admin: false,
      NAMES: ['info', 'transfer-taksi', 'habitation', 'rental', 'event', 'forChildren', 'instructor-tours', 'news', 'ads'],
      index: 0
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
      this.id = this.getCookieValue('id')
      let response = await axios.post(`/check_admin`, {
        id: this.id
      });

      this.admin = response.data.admin;
    },
    namepage(el) {
      return this.name[el];
    },

    getCookieValue(name) {
      const cookies = document.cookie.split("; ");
      let res;
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        if (cookie.slice(0, 2) == name) {
          res = cookie.replace(name + "=", "");
        }
      }
      return res;
    },

    go_back() {
      if (this.index == 0) {
        this.index = this.NAMES.length - 1
      } else {
        this.index -= 1
      }
      this.$router.push({ name: this.NAMES[this.index] })
    },

    go_up() {
      if (this.index == this.NAMES.length - 1) {
        this.index = 0
      } else {
        this.index += 1
      }
      this.$router.push({ name: this.NAMES[this.index] })
    }
  },
  mounted() {
    this.notifications();
  },
};
</script>

<template>
  <app-nav></app-nav>
  <app-slider></app-slider>
  <div class="site-page">
    <span @click="go_back">
      <img class="arrow left_arrow" src="/src/assets/img/arrow-down-sign-to-navigate.png" alt="" />
    </span>
    <span class="namepage">{{ namepage($route.name) }}</span>
    <span @click="go_up">
      <img class="arrow right_arrow" src="/src/assets/img/arrow-down-sign-to-navigate.png" alt="" />
    </span>
  </div>
  <app-center></app-center>
  <div class="wrapperBottom">
    <app-admin v-if="admin" > </app-admin>
    <app-phone></app-phone>
  </div>
</template>

<style>
.arrow {
  width: 30px;
}

.arrow:hover, .arrow:active {
  filter: brightness(1000%);
}

.left_arrow {
  transform: rotate(90deg);
}

.right_arrow {
  transform: rotate(270deg);
}

.namepage {
  width: 255px;
  text-align: center;
}

.site-page {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  color: var(--mainColor);
  font-size: clamp(18px, 5vw, 30px);
  margin: 20px 0 0 20px;
  z-index: 11;
  
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
  bottom: 1%;
  right: 2%;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 50px;
}
@media (max-width: 400px) {
  .wrapperBottom {
    width: 90%;
    right: 4%;
  }
}

@media (max-width: 680px) {
  .arrow {
    width: 21px;
  }

  .namepage {
    width: 180px;
  }
}

@media (max-height: 720px) {
  .wrapperBottom {
    bottom: 0%;
  }

  .list-item-name {
    font-size: 11px;
    line-height: 1.05;
  }

  .site-page {
    margin: 0;
  }
}

/* input{
  color: #ffffff !important; 
} */
</style>
