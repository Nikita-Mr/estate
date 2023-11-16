<script>
import { RouterLink, RouterView } from 'vue-router';
import axios from 'axios';
import { defineComponent } from 'vue';
import { Carousel, Navigation, Slide, Pagination } from 'vue3-carousel';
import * as dayjs from 'dayjs';
import 'dayjs/locale/ru';

import 'vue3-carousel/dist/carousel.css';

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
      todaydate: dayjs(new Date()).format(`ddd, D MMM`),
      message: '',
      passenger2: 0
    };
  },
  mounted() {
    this.loadCard();
  },
  methods: {
    async loadCard() {
      let response = await axios.get(`/transfer`, {
        params: { id: this.$route.query.id },
        headers: {
          Authorization: document.cookie.replace(`token=`, ``),
        },
      });
      this.INFO = response.data.transfer;
      this.passenger2 = this.INFO.passenger / 2
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
    getDate(data) {
      let date = new Date(data);
      let day = dayjs(date);
      dayjs.locale('ru');
      return day.format(`dd, D MMM`);
    },
    async book() {
      let response = await axios.get(`/transfer`, {
        params: { id: this.INFO.id, book: true },
        headers: {
          Authorization: document.cookie.replace(`token=`, ``),
        },
      });
      this.message = response.data.message;
      this.loadCard();
    },

    async payment() {
      let response = await axios.post(`/payment`, {
        name: this.INFO.name,
        price: this.INFO.price
      }
      )
    }
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
      <h2>{{ getDate(INFO.datefrom) }}</h2>
      <div class="wrapper">
        <div class="start-drive"></div>
        <div class="infowrap">
          <div class="time">
            <div class="first">
              <span>{{ INFO.timefrom }}</span>
              <span class="sub">{{ getDate(INFO.datefrom) }}</span>
            </div>
            <div class="second">
              <span>{{ INFO.timeto }}</span>
              <span class="sub">{{ getDate(INFO.dateto) }}</span>
            </div>
          </div>
          <div class="line"></div>
          <div class="city">
            <div class="first">
              <span>{{ INFO.cityfrom }}</span>
              <span class="sub">Мест: {{ INFO.passenger }}</span>
            </div>
            <div class="second">
              <span>{{ INFO.cityto }}</span>
              <div class="wrapsvg">
                <div
                  class="circlesvg"
                  :class="{
                    green:
                      INFO.boardedPlaces < passenger2 && INFO.typeCar == `bus`,
                    green:
                      INFO.boardedPlaces < passenger2 && INFO.typeCar == `car`,
                  }"
                >
                  <ion-icon name="person"></ion-icon>
                </div>
                <div
                  class="circlesvg"
                  :class="{
                    yellow:
                      INFO.boardedPlaces >= passenger2 - 2 &&
                      INFO.boardedPlaces <= passenger2 + 2 &&
                      INFO.typeCar == `bus`,
                    yellow:
                      INFO.boardedPlaces >= passenger2 - 1 &&
                      INFO.boardedPlaces <= passenger1 + 1 &&
                      INFO.typeCar == `car`,
                  }"
                >
                  <ion-icon name="person"></ion-icon>
                </div>
                <div
                  class="circlesvg"
                  :class="{
                    red:
                      INFO.boardedPlaces <= passenger &&
                      INFO.boardedPlaces > passenger2 &&
                      INFO.typeCar == `bus`,
                    red:
                      INFO.boardedPlaces <= passenger &&
                      INFO.boardedPlaces > passenger2 &&
                      INFO.typeCar == `car`,
                  }"
                >
                  <ion-icon name="person"></ion-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div class="passenger-price">
          <span>Итого за 1 пассажира {{ INFO.price }} ₽</span>
        </div>
        <hr />
        <div class="driver">
          <span class="text-center mt-3">{{ INFO.name }}</span>
          <span class="text-center mt-3">Иногда отменяет поездки</span>
          <span class="text-center mt-3"
            >Ваше бронирование будет подтверждено мгновенно</span
          >
          <span class="text-center mt-3">Максимум двое сзади</span>
        </div>
      </div>
      <div class="reviews"></div>
      <div class="button-wrapper">
        <span v-if="message" class="text-center mt-3">{{ message }}</span>
        <button v-if="!admin" @click="book">Забронировать</button>
        <button @click="target = 1" class="btn btn-outline-danger" v-if="admin">
          Удалить
        </button>
        <button @click="edit" class="btn btn-outline-light" v-if="admin">
          Редактировать
        </button>
        <button @click="payment" class="btn btn-outline-success">
          Оплатить
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  color: #000;
}
.driver span {
  border-bottom: 1px solid #ffffff72;
  width: 80%;
}
.driver {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.time {
  width: 70px;
}
.city {
  width: min-content;
}
hr {
  height: 5px;
  border-radius: 20px;
  background: #fff;
}
.passenger-price {
  text-align: center;
}
.infowrap {
  display: flex;
  height: 100px;
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
}
.first span {
  width: 100%;
}
.first {
  height: 50%;
  display: flex;
  flex-wrap: wrap;
}
.sub {
  font-size: 13px;
  display: inline-block;
}
span:not(.sub, .cars span) {
  font-weight: 600;
  display: grid;
}
.line {
  transform: rotate(90deg);
  align-self: center;
  margin-bottom: 25px;
  left: -10px;
  max-width: 40px;
  background: black;
  position: relative;
}
.line::after {
  content: " ";
  position: absolute;
  top: -4px;
  left: -10px;
  width: 10px;
  height: 10px;
  background: transparent;
  border: 2px solid #000;
  border-radius: 100%;
}
.line::before {
  content: " ";
  position: absolute;
  bottom: -4px;
  left: 100%;
  width: 10px;
  height: 10px;
  background: transparent;
  border: 2px solid #000;
  border-radius: 100%;
}
.wrapsvg {
  width: 100%;
  display: flex;
  gap: 5px;
}
.circlesvg {
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background: #dedede;
}
h2 {
  width: 100%;
  text-align: center;
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
  max-height: 400px;
  overflow-y: scroll;
}
.card-wrapper::-webkit-scrollbar {
  display: none;
}

.wrapper {
  padding: 10px;

  width: 100%;
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
  justify-content: center;
  align-items: center;
  gap: 20px;
}

/* button {
  display: block;
  margin: 0 auto;
  border: none;
  border-radius: 10px;
  padding: 5px 7px;
  box-shadow: 0 0 10px 0 #00000037;
} */

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
