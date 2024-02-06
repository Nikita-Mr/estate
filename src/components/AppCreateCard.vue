<script>
import { RouterLink, RouterView } from "vue-router";
import axios from "axios";
import { defineComponent } from "vue";
import { Carousel, Navigation, Slide, Pagination } from "vue3-carousel";

import "vue3-carousel/dist/carousel.css";

export default defineComponent({
  components: {
    Carousel,
    Slide,
    Navigation,
    Pagination,
  },
  data() {
    return {
      files: ``,
      img: "",
      title: ``,
      address: ``,
      email: "",
      chatID: "",
      phone: ``,
      price: null,
      description: ``,
      status: ``,
      error: ``,
      INFO: {},
      edit: false,
      switch: 1,
      workbook: "",
      createn: 0,
      brony: 0,
      category: this.$route.query.category,
      subcategory: this.$route.query.subcategory,
      namebrony: {
        title: "название",
        floor: "Этажей",
        lease_term: "Минимальный срок аренды, суток",
        total_area: "общая площадь, кв м",
        sleeping_rooms: "спальных комнат",
        sleeping_places: "спальных мест основных",
        children_bed: "Детская кровать",
        double_places: "двуспальные места",
        single_spaces: "односпальные места",
        additional_sleeping_places: "дополнительные спальные места",
        bathrooms: "санузлов",
        bathrooms_showers: "ванных/душевых",
        drying_for_inventory: "сушилка для инвентаря",
        wifi: "Wi-Fi",
        warm_floor: "Тёплый пол",
        dishwasher: "посудомойка",
        parking_cars: "парковка, машин",
        mall: "мангал",
        kazan: "казан",
        bath_territory: "баня на территори",
        pool: "Бассейн Летом/зимой",
        transfer_city: "Трансфер с городов",
        transfer_mountain: "Трансфер на гору",
        live_whith_animals: "Можно проживать с животными",
        additionally: "дополнительно",
      },
      index: "",
      NUMBERINDEX: "",
      value: "",
      floor: 0,
      lease_term: 0,
      total_area: 0,
      sleeping_rooms: 0,
      sleeping_places: 0,
      children_bed: "",
      double_places: 0,
      single_spaces: 0,
      additional_sleeping_places: 0,
      bathrooms: 0,
      bathrooms_showers: 0,
      drying_for_inventory: "",
      wifi: "",
      warm_floor: "",
      dishwasher: "",
      parking_cars: 0,
      mall: "",
      kazan: "",
      bath_territory: "",
      pool: "",
      transfer_city: "",
      transfer_mountain: "",
      live_whith_animals: "",
      additional: "",
      title: "",
    };
  },
  mounted() {
    this.loadCard();
  },
  methods: {
    async create() {},
    handleFilesUpload() {
      this.files = this.$refs.files.files;
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

    async submitFiles() {
      let formData = new FormData();
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        formData.append("files", file);
      }
      await axios
        .post("/create-card", {
          title: this.title,
          price: this.price,
          p: this.description,
          phone: this.phone,
          address: this.address,
          email: this.email,
          chatID: this.chatID,
          userID: this.getCookieValue("id"),
          subcategory: this.$route.query.name,
          category: this.$route.query.category,
          floor: this.floor,
          lease_term: this.lease_term,
          total_area: this.total_area,
          sleeping_rooms: this.sleeping_rooms,
          sleeping_places: this.sleeping_places,
          children_bed: this.children_bed,
          double_places: this.double_places,
          single_spaces: this.single_spaces,
          additional_sleeping_places: this.additional_sleeping_places,
          bathrooms: this.bathrooms,
          bathrooms_showers: this.bathrooms_showers,
          drying_for_inventory: this.drying_for_inventory,
          wifi: this.wifi,
          warm_floor: this.warm_floor,
          dishwasher: this.dishwasher,
          parking_cars: this.parking_cars,
          mall: this.mall,
          kazan: this.kazan,
          bath_territory: this.bath_territory,
          pool: this.pool,
          transfer_city: this.transfer_city,
          transfer_mountain: this.transfer_mountain,
          live_whith_animals: this.live_whith_animals,
          additionally: this.additionally,
        })
        .then((e) => {
          console.log(`card creation return: ${e.data.text}`);

          let routeAppend = new String();

          console.log(`response info is: ${e.data.message}`);
          if (!isNaN(e.data.message))
            routeAppend = `?id=${e.data.message}&category=${this.$route.query.category}`;

          let uploadRoute = `/upload${routeAppend}`;

          console.log(`card creation response ${e.data.message}`);
          console.log(`upload route is ${uploadRoute}`);

          axios
            .post(uploadRoute, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((r) => {
              console.log(`got code 200 on upload: ${e.data.text}`);
            })
            .catch((r) => {
              console.log(`got code 400 on upload: ${e.data.text}`);
            });
          this.error = e.data.message;
          this.status = e.data.status;
        });
      if (this.status == "200") {
        this.$router.go(-1);
      }
    },
    url(file) {
      return URL.createObjectURL(file);
    },
    remove(file) {
      let files = Array.from(this.files);
      files.forEach((el, i) => {
        if (el.name == file.name) {
          files.splice(i, 1);
        }
      });
      this.files = files;
      if (this.edit) {
        console.log(file);
        this.img.forEach((el, i) => {
          if (file.name == el.name) {
            this.img.splice(i, 1);
          }
        });
      }
    },
    async editCard() {
      let formData = new FormData();
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        formData.append("files", file);
      }
      await axios
        .post(`/create-card`, {
          img: this.img,
          id: this.$route.query.id,
          category: this.$route.query.name,
          title: this.title,
          price: this.price,
          p: this.description,
          phone: this.phone,
          address: this.address,
          email: this.email,
          edit: true,
          login: true,
          floor: this.floor,
          lease_term: this.lease_term,
          total_area: this.total_area,
          sleeping_rooms: this.sleeping_rooms,
          sleeping_places: this.sleeping_places,
          children_bed: this.children_bed,
          double_places: this.double_places,
          single_spaces: this.single_spaces,
          additional_sleeping_places: this.additional_sleeping_places,
          bathrooms: this.bathrooms,
          bathrooms_showers: this.bathrooms_showers,
          drying_for_inventory: this.drying_for_inventory,
          wifi: this.wifi,
          warm_floor: this.warm_floor,
          dishwasher: this.dishwasher,
          parking_cars: this.parking_cars,
          mall: this.mall,
          kazan: this.kazan,
          bath_territory: this.bath_territory,
          pool: this.pool,
          transfer_city: this.transfer_city,
          transfer_mountain: this.transfer_mountain,
          live_whith_animals: this.live_whith_animals,
          additionally: this.additionally,
        })
        .then((e) => {
          if (formData) {
            axios
              .post("/upload", formData, {
                params: {
                  id: this.$route.query.id,
                  category: this.$route.query.name,
                },
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then(function () {
                console.log("SUCCESS!!");
              })
              .catch(function () {
                console.log("FAILURE!!");
              });
            this.error = e.data.message;
            this.status = e.data.status;
          }

          if (e.data.status == "200") {
            setTimeout(() => {
              this.$router.go(-1);
              this.error = "";
              this.status = "";
            }, 3000);
          }
        });
    },
    async loadCard() {
      let id = this.$route.query.id;
      let name = this.$route.query.name;
      if (id && name) {
        let response = await axios.post(`/card`, {
          id: id,
          name: name,
        });
        this.edit = this.$route.query.edit;
        this.INFO = response.data.card;
        console.log(this.INFO);
        this.img = this.INFO.img;
        this.title = this.INFO.title;
        this.price = this.INFO.price;
        this.phone = this.INFO.phone;
        this.address = this.INFO.address;
        this.description = this.INFO.p;
        this.email = this.INFO.email;
        this.chatID = this.INFO.chatID;
        this.floor = this.INFO.floor;
        this.lease_term = this.INFO.lease_term;
        this.total_area = this.INFO.total_area;
        this.sleeping_rooms = this.INFO.sleeping_rooms;
        this.sleeping_places = this.INFO.sleeping_places;
        this.children_bed = this.INFO.children_bed;
        this.double_places = this.INFO.double_places;
        this.single_spaces = this.INFO.single_spaces;
        this.additional_sleeping_places = this.INFO.additional_sleeping_places;
        this.bathrooms = this.INFO.bathrooms;
        this.bathrooms_showers = this.INFO.bathrooms_showers;
        this.drying_for_inventory = this.INFO.drying_for_inventory;
        this.wifi = this.INFO.wifi;
        this.warm_floor = this.INFO.warm_floor;
        this.dishwasher = this.INFO.dishwasher;
        this.parking_cars = this.INFO.parking_cars;
        this.mall = this.INFO.mall;
        this.kazan = this.INFO.kazan;
        this.bath_territory = this.INFO.bath_territory;
        this.pool = this.INFO.pool;
        this.transfer_city = this.INFO.transfer_city;
        this.transfer_mountain = this.INFO.transfer_mountain;
        this.live_whith_animals = this.INFO.live_whith_animals;
        this.additionally = this.INFO.additionally;
      }
    },
  },
});
</script>

<template>
  <div class="card-wrapper">
    <transition name="slide-fade">
      <div class="info_open" ref="modal" :class="{ 'd-none': createn == 0 }">
        <header class="title_info">
          <button
            type="button"
            @click="createn = 0"
            class="btn-close"
            aria-label="Close"
          ></button>
        </header>
        <main class="main_info">
          <div class="group">
            <span> Название: </span>
            <span>
              <input type="text" name="" id="" v-model="title" required />
            </span>
          </div>
          <div class="group">
            <span> Этажей: </span>
            <span>
              <input type="number" name="" id="" v-model="floor" required />
            </span>
          </div>
          <div class="group">
            <span> Минимальный срок аренды, суток: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="lease_term"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Общая площадь, кв м: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="total_area"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Спальных комнат: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="sleeping_rooms"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Спальных мест основных: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="sleeping_places"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Детская кровать: </span>
            <span>
              <input
                type="text"
                name=""
                id=""
                v-model="children_bed"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Двуспальные места: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="double_places"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Односпальные места: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="single_spaces"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Дополнительные спальные места: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="additional_sleeping_places"
              />
            </span>
          </div>
          <div class="group">
            <span> Санузлов: </span>
            <span>
              <input type="number" name="" id="" v-model="bathrooms" required />
            </span>
          </div>
          <div class="group">
            <span> Ванных/Душевых: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="bathrooms_showers"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Сушилка для инвентаря: </span>
            <span>
              <input
                type="text"
                name=""
                id=""
                v-model="drying_for_inventory"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Wi-Fi: </span>
            <span>
              <input type="text" name="" id="" v-model="wifi" required />
            </span>
          </div>
          <div class="group">
            <span> Тёплый пол: </span>
            <span>
              <input type="text" name="" id="" v-model="warm_floor" required />
            </span>
          </div>
          <div class="group">
            <span> Посудомойка: </span>
            <span>
              <input type="text" name="" id="" v-model="dishwasher" required />
            </span>
          </div>
          <div class="group">
            <span> Парковка, машин: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="parking_cars"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Мангал: </span>
            <span>
              <input type="text" name="" id="" v-model="mall" required />
            </span>
          </div>
          <div class="group">
            <span> Казан: </span>
            <span>
              <input type="text" name="" id="" v-model="kazan" required />
            </span>
          </div>
          <div class="group">
            <span> Баня на территории: </span>
            <span>
              <input
                type="text"
                name=""
                id=""
                v-model="bath_territory"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Бассейн Летом/зимой: </span>
            <span>
              <input type="text" name="" id="" v-model="pool" required />
            </span>
          </div>
          <div class="group">
            <span> Трансфер из городов: </span>
            <span>
              <input
                type="text"
                name=""
                id=""
                v-model="transfer_city"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Трансфер на гору: </span>
            <span>
              <input
                type="text"
                name=""
                id=""
                v-model="transfer_mountain"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Можно проживать с животными: </span>
            <span>
              <input
                type="text"
                name=""
                id=""
                v-model="live_whith_animals"
                required
              />
            </span>
          </div>
        </main>
        <div class="button-wrapper">
          <button v-if="buttonTarg == 0">Создать</button>
          <span v-if="buttonTarg == 1">Созданно</span>
          <button class="publish" @click="createn = 0">Сохранить</button>
          <button
            class="btn btn-light btn-cancel"
            type="button"
            @click="createn = 0"
          >
            Отмена
          </button>
        </div>
      </div>
    </transition>
    <div class="card">
      <div class="img">
        <input
          type="file"
          ref="files"
          id="file"
          multiple
          v-on:change="handleFilesUpload"
        />
        <label v-if="files == `` && img == ``" for="file">
          <div class="line"><img src="../assets/img/img_add.png" alt="" /></div>
        </label>

        <Carousel v-if="files != ``" :autoplay="4000" :wrap-around="true">
          <Slide v-for="slide in files" :key="slide">
            <div class="carousel__item">
              <div class="imgCross">
                <img :ref="url(slide)" :src="url(slide)" alt="" />
                <button @click="remove(slide)" class="cross">
                  <ion-icon name="close-outline"></ion-icon>
                </button>
              </div>
            </div>
          </Slide>

          <template #addons>
            <Navigation />
            <Pagination />
          </template>
        </Carousel>

        <Carousel v-if="img != ``" :autoplay="4000" :wrap-around="true">
          <Slide v-for="slide in img" :key="slide">
            <div class="carousel__item">
              <div class="imgCross">
                <img :src="`/dist/assets/img/user/` + slide" alt="" />
                <button @click="remove(slide)" class="cross">
                  <ion-icon name="close-outline"></ion-icon>
                </button>
              </div>
            </div>
          </Slide>

          <template #addons>
            <Navigation />
            <Pagination />
          </template>
        </Carousel>
      </div>
      <div class="info">
        <input v-model="title" type="text" placeholder="Название" />

        <input
          v-model="price"
          type="number"
          v-if="subcategory != 'hotels'"
          placeholder="Цена"
        />

        <input v-model="address" type="text" placeholder="Адрес" />

        <input v-model="phone" type="tel" placeholder="Номер телефона" />

        <input v-model="email" type="email" placeholder="Почтовый адрес" />

        <input v-model="chatID" type="text" placeholder="чат ID" />

        <div class="telegramBot">
          <a href="https://t.me/SNEGINFO_BOT" target="_blank">
            <img class="teleg" src="../assets/img/telegram.png" alt="" />
            <span class="text"
              >Чтобы получать уведомления по вашему объекту, перейдите в
              телеграм, нажав на иконку и напишите "/start", получите чат
              ID</span
            >
          </a>
        </div>
      </div>
      <div class="body">
        <textarea
          v-model="description"
          placeholder="Описание"
          name=""
          id=""
        ></textarea>
      </div>
      <div class="button-wrapper">
        <button v-if="!edit" class="publish" @click="submitFiles">
          Опубликовать
        </button>
        <button v-if="category=='habitation'" class="btn btn-info" @click="this.createn = 1">
          Полная информация
        </button>
        <button v-if="edit" class="publish" @click="editCard">Сохранить</button>
      </div>
      <div v-if="error" class="notification-container">
        <div :class="{ error: status == 400, success: status == 200 }">
          <span>{{ error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title_info {
  text-align: center;
  font-size: large;
  height: 20%;
}

.main_info {
  margin-top: 7px;
}
.info_open {
  position: absolute;
  top: 0%;
  min-width: 310px;
  width: 80%;
  min-height: 288px;
  height: 65vh;
  background: linear-gradient(45deg, #f2f2f2, #fff);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  border: 1px solid #fff;
  border-radius: 15px;
  padding: 10px 20px;
  z-index: 20;
  display: grid;
  overflow-x: hidden;
  overflow-y: scroll;
}

.btn-close {
  border: none;
  position: absolute;
  right: 2%;
  top: 2%;
}

.btn-close:focus,
.btn-close:active,
.btn-close:active:focus:not(:disabled):not(.disabled) {
  box-shadow: none !important;
  outline: 0;
}

.info_open input {
  border: 1px solid black;
  color: black;
}

.info_open .group {
  font-weight: 500;
  color: black;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.notification-container {
  position: fixed;
  bottom: 3%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.success {
  background-color: #87e752;
  border-radius: 15px;
  padding: 7px 12px;
  color: #fff;
}
.error {
  background-color: #ed1c24;
  border-radius: 15px;
  padding: 7px 12px;
  color: #fff;
  font-weight: 550;
}

.telegramBot {
  padding: 7px;
}

.telegramBot a {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-direction: row;

  transition: all 400ms;
}

.telegramBot img:hover {
  transform: scale(1.07);
}

.text {
  font-size: 0.9rem !important;
}

.teleg {
  height: 40px !important;
  width: 40px;

  transition: all 400ms;
}

@media (max-width: 426px) {
  label {
    height: 200px !important;
  }
}
.imgCross {
  position: relative;
}
.cross {
  color: red;
  z-index: 20;
  width: 20px;
  background: transparent;
  box-shadow: none;
  height: auto;
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  justify-content: center;
  align-items: center;

  transition: all 500ms;
}

.cross:hover {
  transform: scale(1.4);
}

.carousel {
  height: 100%;
}
.carousel__item {
  min-height: 200px;
  width: 100%;
  background-color: var(--vc-clr-primary);
  color: var(--vc-clr-white);
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel__slide {
  padding: 10px;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  border: 5px solid white;
}
.carousel__slide {
  width: 100% !important;
}
input::placeholder {
  color: #fff;
}
textarea::placeholder {
  color: #fff;
}

input {
  color: #fff;
  transition: all 500ms ease;
}

input:active,
input:focus,
input:hover {
  box-shadow: 0 0 10px 0 black;
  border: none;
  outline: none;
}

textarea {
  height: 100%;
  background: transparent;
  border: 1px solid var(--mainColor);
  padding: 5px;
  border-radius: 10px;
  color: #fff;
}
.info {
  gap: 10px;
}
.body {
  margin-top: 10px;
}
input {
  background: transparent;
  border: 1px solid var(--mainColor);
  border-radius: 10px;
  padding: 0 35px 0 5px;
  width: 100%;
  height: 50px;
}
input:nth-child(2) {
  width: 95%;
  height: 40px;
}

input:nth-child(3) {
  width: 90%;
  height: 40px;
}

input:nth-child(4) {
  width: 85%;
  height: 40px;
}

input:nth-child(5) {
  width: 80%;
  height: 40px;
}

#file {
  display: none;
}
label {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  border: 1px solid var(--mainColor);
  border-radius: 10px;
  max-height: 200px !important;
}

.line img {
  width: 50px !important;
  height: 50px !important;
}

.carousel {
  height: 100%;
}
@media (max-width: 426px) {
  .info {
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

.info {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 50%;
}
.info span {
  font-size: 2rem;
  display: block;
}
.price {
  font-size: 1.5rem !important ;
}
.card {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
  background: transparent;
  border: none;
  min-height: 400px;
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
  align-items: stretch;
  gap: 15px;
}

.btn-info {
  background: linear-gradient(45deg, #09203f, #537895);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  border: none;
  color: #fff;
  border-radius: 10px;

  transition: all 500ms ease;
}

button {
  border: none;
  box-shadow: none;
}

button:active {
  box-shadow: none;
}

@media (max-width: 990px) {
  .info_open {
    height: 74vh;
  }
}

@media (max-width: 771px) {
  .info_open {
    width: 95%;
  }

  .card-wrapper {
    width: 100%;
    height: 65vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}

@media (max-width: 566px) {
  .img {
    width: 100%;
    min-height: 200px;
  }
}

@media (max-width: 450px) {
  .info {
    width: 100%;
  }
}

@media (max-height: 780px) {
  .card-wrapper {
    width: 100%;
    height: 70vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .info_open {
    height: 70vh;
  }
}
</style>
