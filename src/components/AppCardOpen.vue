<script>
import { RouterLink, RouterView } from 'vue-router';
import axios from 'axios';
import { defineComponent } from 'vue';
import { Carousel, Navigation, Slide, Pagination } from 'vue3-carousel';

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
  },
  data() {
    return {
      INFO: {},
      admin: ``,
      target: 0,
    };
  },
  mounted() {
    this.loadCard();
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
        query: { id: this.INFO.id, name: this.$route.query.name , edit: true },
      });
    },
  },
});
</script>

<template>
  <div class="card-wrapper">
    <div class="card">
      <div class="modalDelete" :class="{ 'd-none': target == 0 }">
        <div class="button-wrapper">
          <button @click="deleteCard" class="delete" v-if="admin">
            Удалить
          </button>
          <button @click="target = 0" v-if="admin">Отмена</button>
        </div>
      </div>
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
      <div class="wrapper">
        <div class="info">
          <span class="title">{{ INFO.title }}</span>
          <span class="price">{{ INFO.price }} руб</span>
          <span class="adress">{{ INFO.address }}</span>
          <span class="phone mb-2">{{ INFO.phone }}</span>
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
        <!-- <div class="wrapper-for-map">
          <div id="customMap" class="map"></div>
        </div> -->
      </div>
      <div class="body">
        <span class="description">{{ INFO.p }}</span>
      </div>
      <div class="reviews"></div>
      <div class="button-wrapper">
        <button v-if="!admin">Купить</button>
        <button @click="target = 1" class="delete" v-if="admin">Удалить</button>
        <button @click="edit" class="edit" v-if="admin">Редактировать</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  width: 50%;
  height: auto;
  float: left;
  position: relative;
}

.card-wrapper {
  width: 80%;
  color: var(--mainColor);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  min-height: 400px;
}

.wrapper {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
}

.wrapper-for-map {
  width: 50%;
  border: 1px solid white;
}

.info span {
  font-size: 2rem;
  display: block;
}

.info {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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

.description {
  margin-top: 10px;
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
  justify-content: center;
  align-items: center;
  gap: 20px;
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
