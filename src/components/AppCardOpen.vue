<script>
import { RouterLink, RouterView } from 'vue-router';
import axios from 'axios';
import { defineComponent } from 'vue';
import { Carousel, Navigation, Slide, Pagination } from 'vue3-carousel';
import AppCard from '/src/components/AppCard.vue';

import 'vue3-carousel/dist/carousel.css';

// ymaps.ready(init); // когда апи готово, инициализируемя карту
// var customMap; // объявим переменную для карты
// async function init() {
//   // функция инициализации
//   customMap = new ymaps.Map('customMap', {
//     // создадим карту выведем ее в див с id="customMap"
//     center: [25.15, 55.18], // центра карты
//     behaviors: ['default', 'scrollZoom'], // скроллинг колесом
//     zoom: 10, // масштаб карты
//     controls: ['zoomControl', 'fullscreenControl'], // элементы управления
//   });
//   myGeocoder.then(console.log(res.geoObjects.get(0).geometry.getCoordinates()));

//   // customMap.controls.remove('geolocationControl'); // удаляем геолокацию
//   // customMap.controls.remove('searchControl'); // удаляем поиск
//   // customMap.controls.remove('trafficControl'); // удаляем контроль трафика
//   // customMap.controls.remove('typeSelector'); // удаляем тип
//   // customMap.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
//   // customMap.controls.remove('zoomControl'); // удаляем контрол зуммирования
//   // customMap.controls.remove('rulerControl'); // удаляем контрол правил
// }

export default defineComponent({
  components: {
    Carousel,
    Slide,
    Navigation,
    Pagination,
    AppCard,
  },
  data() {
    return {
      INFO: {},
      NUMBER: {},
      price: ``,
      admin: ``,
      target: 0,
      phone: '',
      fromdate: Date,
      todate: Date,
      adults: ``,
      children: ``,
      name: ``,
      description: ``,
      value: ``,
      message: ``,
      status: ``,
      numberid: ``,
    };
  },
  mounted() {
    this.loadCard();
    this.loadNumber();
  },
  methods: {
    async loadCard() {
      let response = await axios.get(`/card`, {
        params: { id: this.$route.query.id, name: this.$route.query.name },
        headers: {
          Authorization: document.cookie.replace(`token=`, ``),
        },
      });
      this.INFO = response.data.card;
      this.admin = response.data.admin;
    },
    async deleteCard() {
      await axios
        .post('/deleteCard', {
          id: this.INFO.id,
          name: this.$route.query.name,
        })
        .then((e) => {
          if (e.data.status == '200') {
            this.$router.go(-1);
          }
        });
    },
    async edit() {
      this.$router.push({
        path: '/create-card',
        query: { id: this.INFO.id, name: this.$route.query.name, edit: true },
      });
    },
    async trybook() {
      let response = await axios.post(`/trybook`, {
        id: this.$route.query.id,
        number: this.numberid,
        phone: this.phone,
        fromdate: this.fromdate,
        todate: this.todate,
      });
    },
    async createNumber() {
      let response = await axios.post(`/create-number`, {
        name: this.name,
        adults: this.adults,
        children: this.children,
        description: this.description,
        hotel: this.$route.query.id,
        value: this.value,
        price: this.price,
      });
    },
    async loadNumber() {
      let response = await axios.get(`/number`, {
        params: { id: this.$route.query.id },
      });
      this.NUMBER = response.data.number;
    },
  },
});
</script>

<template>
  <div class="card-wrapper">
    <div class="card">
      <div class="modalDelete" :class="{ 'd-none': target == 0 }">
        <div v-if="admin" class="button-wrapper">
          <button @click="deleteCard" class="delete" v-if="admin">
            Удалить
          </button>
          <button @click="target = 0" v-if="admin">Отмена</button>
        </div>
        <div v-if="!admin" class="input-wrapper">
          <form @submit.prevent="trybook">
            <input
              v-model="phone"
              type="tel"
              id="phone"
              name="phone"
              pattern="+7[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder="+7 (900)-900-99-99"
              required
            />
            <input type="date" v-model="fromdate" placeholder="От" required />
            <input type="date" v-model="todate" placeholder="До" required />
            <div class="center">
              <button @click="target = 1" v-if="!admin">Забронировать</button>
            </div>
          </form>
        </div>
      </div>
      <div class="left">
        <div class="img">
          <Carousel :autoplay="4000" :wrap-around="true">
            <Slide v-for="slide in INFO.img" :key="slide">
              <div class="carousel__item">
                <img :src="`/dist/assets/img/user/` + slide" alt="" />
              </div>
            </Slide>

            <template #addons>
              <Navigation />
              <Pagination />
            </template>
          </Carousel>
        </div>
        <div class="info">
          <div class="nameWrapp">
            <span class="title">{{ INFO.title }}</span>
            <span class="price">{{ INFO.price }} руб</span>
          </div>
          <span class="adress">{{ INFO.address }}</span>
          <span class="phone">{{ INFO.phone }}</span>
          <span class="description">{{ INFO.p }}</span>
          <div class="messengers">
            <a href="#" target="_blank">
              <img src="/src/assets/img/viber.png" alt="viber" />
            </a>
            <a href="#" target="_blank">
              <img src="/src/assets/img/whatsapp.png" alt="whatsapp" />
            </a>
            <a href="#" target="_blank">
              <img src="/src/assets/img/telegram.png" alt="telegram" />
            </a>
          </div>
        </div>
      </div>
      <div class="wrapper">
        <form v-if="admin && $route.query.name == `habitation`" @submit.prevent="createNumber">
          <input type="text" v-model="name" placeholder="Название номера" />
          <input type="number" v-model="price" placeholder="Цена" />
          <input type="number" v-model="adults" placeholder="Кол-во взрослых" />
          <input type="number" v-model="children" placeholder="Кол-во детей" />
          <input type="text" v-model="description" placeholder="Описание" />
          <input
            type="number"
            v-model="value"
            placeholder="Кол-во номеров в гостинице"
          />
          <button>Забронировать</button>
        </form>
        <app-card
          v-if="!admin"
          v-for="(item, index) in NUMBER"
          @click="target = 1, numberid = index"
          :i="index"
          :title="item.name"
          :price="item.price"
          :children="item.children"
          :adults="item.adults"
          :p="item.description"
          :id="item.id"
        ></app-card>
        <!-- <div class="wrapper-for-map">
          <div id="customMap" class="map"></div>
        </div> -->
      </div>
      <div class="body"></div>
      <div class="reviews"></div>
      <div class="button-wrapper">
        <!-- <button @click="target = 1" v-if="!admin">Забронировать</button> -->
        <button @click="target = 1" class="delete" v-if="admin">Удалить</button>
        <button @click="edit" class="edit" v-if="admin">Редактировать</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.nameWrapp {
  display: flex;
  justify-content: space-between;
}
.wrapper .card {
  width: 100%;
  min-height: 130px;
}
.left {
  width: 50%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  padding: 20px;
}
form {
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}
.input-wrapper {
  width: 100%;
}
.input-wrapper .center {
  position: absolute;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.input-wrapper input {
  border-radius: 10px;
  border: none;
  padding: 10px;
}
.input-wrapper form {
  padding: 50px;
  gap: 10px;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  width: 100%;
}
.delete {
  background-color: rgba(230, 86, 86, 0.992);
  color: #fff;
}
.modalDelete {
  width: 100%;
  position: absolute;
  z-index: 1000;
  background: rgb(100 100 100 / 41%);
  left: 0;
  height: 100%;
  border-radius: 10px;
  display: flex;
  backdrop-filter: blur(10px);
  align-items: center;
}
.carousel {
  height: 100%;
}

@media (max-width: 426px) {
  .wrapper {
    width: 100% !important;
  }

  .img {
    width: 100% !important;
  }
}

.img {
  width: 100%;
  height: auto;
  float: left;
  position: relative;
}

.card-wrapper {
  display: flex;
  justify-content: center;
  width: 80%;
  color: var(--mainColor);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  min-height: 400px;
}

.wrapper {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  width: 50%;
  overflow-y: scroll;
}
.wrapper input {
  padding: 5px;
  border-radius: 10px;
  border: none;
}
.wrapper::-webkit-scrollbar {
  display: none;
}

.wrapper-for-map {
  width: 50%;
  border: 1px solid white;
}

.info span {
  font-size: 1.5rem;
  display: block;
}

.info {
}

.price {
  font-size: 1.5rem !important;
}

.card {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
  background: transparent;
  border: none;
  min-height: 400px;
  position: relative;
  width: 100%;
}

.carousel__slide {
  width: 100% !important;
}

img {
  width: 100%;
  border-radius: 5px;
  height: 200px !important;
  object-fit: cover;
}

.title {
  font-size: 20px;
}

.price {
  font-size: 15px;
}

.body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.button-wrapper {
  margin-top: 10px;
  width: 100%;
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

button {
  display: block;
  margin: 0 auto;
  border: none;
  width: 50%;
  padding: 5px 0;
  box-shadow: 0 0 10px 0 #00000037;
}

button:active {
  box-shadow: none;
}

.messengers {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.messengers a {
  width: auto;
}

.messengers img {
  height: 27px !important;
  width: auto;
}

.phone {
  font-size: 1.4rem !important;
}

.adress {
  font-size: 1rem !important;
}
</style>
