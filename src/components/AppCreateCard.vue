<script>
import { RouterLink, RouterView } from "vue-router";
import axios from "axios";
import { defineComponent } from "vue";
import { Carousel, Navigation, Slide, Pagination } from "vue3-carousel";

import "vue3-carousel/dist/carousel.css";
import { param } from "express-validator";

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
      adress: ``,
      email: "",
      chatID: "",
      phone: ``,
      price: null,
      description: ``,
      status: ``,
      error: ``,
      INFO: {},
      edit: false,
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
          adress: this.adress,
          email: this.email,
          chatID: this.chatID,
          subcategory: this.$route.query.name,
          category: this.$route.query.category,
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
          adress: this.adress,
          email: this.email,
          edit: true,
          login: true,
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
            this.$router.go(-1);
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
        this.img = this.INFO.img;
        this.title = this.INFO.title;
        this.price = this.INFO.price;
        this.phone = this.INFO.phone;
        this.adress = this.INFO.address;
        this.description = this.INFO.p;
        this.email = this.INFO.email;
        this.chatID = this.INFO.chatID;
      }
    },
  },
});
</script>

<template>
  <div class="card-wrapper">
    <div class="card">
      <div class="img">
        <button @click="files = ``" class="cross">
          <ion-icon name="close-outline"></ion-icon>
        </button>
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
          v-if="$route.query.name != 'hotels'"
          placeholder="Цена"
        />

        <input v-model="adress" type="text" placeholder="Адрес" />

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
        <button v-if="!edit" @click="submitFiles">Создать</button>
        <button v-if="edit" @click="editCard">Сохранить</button>
      </div>
      <div :class="{ success: status == 200, error: status != 200 }">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.error {
  position: absolute;
  bottom: -100px;
  color: crimson;
}
.success {
  position: absolute;
  bottom: -100px;
  color: #62a87c;
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

.button-wrapper button {
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #62a87c;
  border-radius: 10px;
  color: #62a87c;
  font-weight: 600;
  transition: scale 500ms;
}

.button-wrapper button:hover {
  scale: 1.03;
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
  align-items: flex-end;
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

@media (max-height: 780px) {
  .card-wrapper {
    width: 100%;
    height: 70vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>
