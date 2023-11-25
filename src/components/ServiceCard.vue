<script>
import { RouterLink, RouterView } from 'vue-router';
import axios from 'axios';
import { defineComponent } from 'vue';
import { Carousel, Navigation, Slide, Pagination } from 'vue3-carousel';

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
    };
  },
  methods: {
    async loadCard() {
      let response = await axios.post(`/service-card`, {
        id: this.$route.query.id
      });
      this.$nextTick(() => {
        this.INFO = response.data.card;
      })
      this.admin = response.data.admin;
    },
    async delete_service() {
      await axios
        .post('/delete_service', {
          id: this.INFO.id,
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
  mounted() {
    this.loadCard();
  },
});
</script>

<template>
  <div class="card-wrapper">
    <div class="card">
      <div class="modalDelete" :class="{ 'd-none': target == 0 }">
        <div class="button-wrapper">
          <button @click="delete_service" class="delete" v-if="admin">
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
          <span class="title">{{ INFO.name }}</span>
          <span class="phone mb-2">{{ INFO.phone }}</span>
        </div>
      </div>
      <div class="body">
        <span class="description">{{ INFO.description }}</span>
      </div>
      <div class="reviews"></div>
      <div class="button-wrapper" v-if="!view">
        <button v-if="!admin">Купить</button>
        <button @click="delete_service" class="delete" v-if="admin">Удалить</button>
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
