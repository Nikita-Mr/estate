<script>
import { RouterLink, RouterView } from 'vue-router';
import AppCard from '/src/components/AppCard.vue';
import axios from 'axios';
import * as XLSX from 'xlsx/xlsx.mjs';
export default {
  components: {
    AppCard,
  },
  data() {
    return {
      INFO: [],
      admin: '',
      expired: false,
      workbook: '',
    };
  },
  mounted() {
    this.loadInfo();
  },
  methods: {
    async loadInfo() {
      if (this.$route.path == `/habitation/items`) {
        let response = await axios.post(`/habitation`, {
          id: this.getCookieValue('id'),
          category: this.$route.path.slice(1, -6),
          name: this.$route.query.name,
        });
        this.INFO = response.data.cards.reverse();
        this.admin = response.data.admin;
        this.expired = response.data.expired;
        if (this.expired) {
          this.$router.push({ path: `/login` });
        }
      }
      if (this.$route.path == `/event/items`) {
        let events = await axios.post(`/event`, {
          id: this.getCookieValue('id'),
          category: this.$route.path.slice(1, -6),
          name: this.$route.query.name,
        });
        this.INFO = events.data.cards.reverse();
        this.admin = events.data.admin;
        this.expired = events.data.expired;
      }
      if (this.$route.path == `/rental/items`) {
        let rental = await axios.post(`/rental`, {
          id: this.getCookieValue('id'),
          category: this.$route.path.slice(1, -6),
          name: this.$route.query.name,
        });
        this.INFO = rental.data.cards.reverse();
        this.admin = rental.data.admin;
        this.expired = rental.data.expired;
      }
      if (this.$route.path == `/forChildren/items`) {
        let forChildren = await axios.post(`/forChildren`, {
          id: this.getCookieValue('id'),
          category: this.$route.path.slice(1, -6),
          name: this.$route.query.name,
        });
        this.INFO = forChildren.data.cards.reverse();
        this.admin = forChildren.data.admin;
        this.expired = forChildren.data.expired;
      }
      if (this.$route.path == `/instructor-tours/items`) {
        let InstructorTours = await axios.post(`/instructor-tours`, {
          id: this.getCookieValue('id'),
          category: this.$route.path.slice(1, -6),
          name: this.$route.query.name,
        });
        this.INFO = InstructorTours.data.cards.reverse();
        this.admin = InstructorTours.data.admin;
        this.expired = InstructorTours.data.expired;
      }
      if (this.$route.path == `/ads/items`) {
        let ads = await axios.post(`/ads`, {
          id: this.getCookieValue('id'),
          category: this.$route.path.slice(1, -6),
          name: this.$route.query.name,
        });
        this.INFO = ads.data.cards.reverse();
        this.admin = ads.data.admin;
        this.expired = ads.data.expired;
      }
    },

    getCookieValue(name) {
      const cookies = document.cookie.split('; ');
      let res;
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        if (cookie.slice(0, 2) == name) {
          res = cookie.replace(name + '=', '');
        }
      }
      return res;
    },

    open(id) {
      this.$router.push({
        path: '/card',
        query: { id: id, name: this.$route.path.slice(1, -6) },
      });
    },
    category(name) {
      return name.slice(0, -5);
    },
    async handleDropAsync(eg) {
      try {
        eg.stopPropagation();
        eg.preventDefault();
        let file = eg.target.files[0];
        /* f is a File */
        let route = this.$route.query.id;
        var reader = new FileReader();
        reader.onload = function (e) {// ТТУУУУУУУУУУУУУУУУУУУУУУУУТ короче вот эта тема не работает хуй знает почему, а в appcardopen работает
          var data = e.target.result;
          // reader.readAsArrayBuffer(file)
          console.log('aaa');
          var workbook = XLSX.read(data);
          console.log(workbook);
          const firstSheetName = workbook.SheetNames[0];

          // Получение данных первого листа в формате JSON
          const worksheet = workbook.Sheets[firstSheetName];
          this.workbook = XLSX.utils.sheet_to_json(worksheet);
          console.log(this.workbook);
          // Вывод данных построчно
          this.workbook.forEach(async (row, i) => {
            await axios.post(`/create-card`, {
              name: this.workbook[i]['название'],
              hotel: route,
              price: this.workbook[i]['цена'],
              floor: this.workbook[i]['Этажей'],
              lease_term: this.workbook[i]['Минимальный срок аренды, суток'],
              total_area: this.workbook[i]['общая площадь, кв м'],
              sleeping_rooms: this.workbook[i]['спальных комнат'],
              sleeping_places: this.workbook[i]['спальных мест основных'],
              children_bed: this.workbook[i]['Детская кровать'],
              double_places: this.workbook[i]['двуспальные места'],
              single_spaces: this.workbook[i]['односпальные места'],
              additional_sleeping_places:
                this.workbook[i]['дополнительные спальные места'],
              bathrooms: this.workbook[i]['санузлов'],
              bathrooms_showers: this.workbook[i]['ванных/душевых'],
              drying_for_inventory: this.workbook[i]['сушилка для инвентаря'],
              wifi: this.workbook[i]['Wi-Fi'],
              warm_floor: this.workbook[i]['Тёплый пол'],
              dishwasher: this.workbook[i]['посудомойка'],
              parking_cars: this.workbook[i]['парковка, машин'],
              mall: this.workbook[i]['мангал'],
              kazan: this.workbook[i]['казан'],
              bath_territory: this.workbook[i]['баня на территории'],
              pool: this.workbook[i]['Бассейн Летом/зимой'],
              transfer_city: this.workbook[i]['Трансфер с городов'],
              transfer_mountain: this.workbook[i]['Трансфер на гору'],
              live_whith_animals:
                this.workbook[i]['Можно проживать с животными'],
              additionally: this.workbook[i]['дополнительно'],
            });
          });
        };
      } catch (e) {
        console.log(e);
      }
    },
    async createNumber(i) {
      let response = await axios.post(`/create-number`, {
        name: this.name,
        adults: this.adults,
        children: this.children,
        description: this.description,
        hotel: this.$route.query.id,
        value: this.value,
        price: this.price,
        floor: this.workbook[i]['Этажей'],
        lease_term: this.workbook[i]['Минимальный срок аренды, суток'],
        total_area: this.workbook[i]['общая площадь, кв м'],
        sleeping_rooms: this.workbook[i]['спальных комнат'],
        sleeping_places: this.workbook[i]['спальных мест основных'],
        children_bed: this.workbook[i]['Детская кровать'],
        double_places: this.workbook[i]['двуспальные места'],
        single_spaces: this.workbook[i]['односпальные места'],
        additional_sleeping_places:
          this.workbook[i]['дополнительные спальные места'],
        bathrooms: this.workbook[i]['санузлов'],
        bathrooms_showers: this.workbook[i]['ванных/душевых'],
        drying_for_inventory: this.workbook[i]['сушилка для инвентаря'],
        wifi: this.workbook[i]['Wi-Fi'],
        warm_floor: this.workbook[i]['Тёплый пол'],
        dishwasher: this.workbook[i]['посудомойка'],
        parking_cars: this.workbook[i]['парковка, машин'],
        mall: this.workbook[i]['мангал'],
        kazan: this.workbook[i]['казан'],
        bath_territory: this.workbook[i]['баня на территории'],
        pool: this.workbook[i]['Бассейн Летом/зимой'],
        transfer_city: this.workbook[i]['Трансфер с городов'],
        transfer_mountain: this.workbook[i]['Трансфер на гору'],
        live_whith_animals: this.workbook[i]['Можно проживать с животными'],
        additionally: this.workbook[i]['дополнительно'],
      });
      if (response.data.status == 200) {
        this.name = ``;
        this.adults = ``;
        this.children = ``;
        this.description = ``;
        this.value = ``;
        this.price = ``;
        this.buttonTarg = 1;
        setTimeout(() => {
          this.buttonTarg = 0;
        }, 1000);
      }
    },
  },
};
</script>

<template>
  <div class="hotel-wrapper">
    <div class="cols create-card">
      <div class="group">
        <RouterLink
          :to="
            `/create-card?name=` +
            $route.query.name +
            `&category=${category($route.name)}`
          "
          class="publish"
        >
          <!-- <div class="cross">
            <div class="line"></div>
            <div class="line"></div>
          </div> -->
          Опубликовать объект
        </RouterLink>
        <input
          type="file"
          ref="files"
          id="file"
          v-on:change="handleDropAsync"
        />
        <label class="publish excel" for="file">
          Опубликовать номера в формате Excel
        </label>
        <div
          class="modalDelete"
          ref="modal"
          :class="{ 'd-none': createn == 0 }"
        ></div>
        <!-- <div class="cross">
            <div class="line"></div>
            <div class="line"></div>
          </div> -->
      </div>
    </div>
    <div class="row row-cols-lg-4 row-cols-md-3 row-cols-sm-2">
      <div v-for="(cardInfo, index) in INFO" class="cols">
        <AppCard
          :i="index"
          :title="cardInfo.title"
          :img="cardInfo.img"
          :price="cardInfo.price"
          :p="cardInfo.p"
          :id="cardInfo.id"
        />
      </div>
    </div>
    <div v-if="INFO.length == 0 || !INFO" class="empty">
      <img src="../../assets/img/empty.png" alt="" /><span>Пусто...</span>
    </div>
  </div>
</template>

<style scoped>
input[type='file'] {
  display: none !important;
}
.publish {
  border: 1px solid #fff;
  border-radius: 10px;
  width: auto !important;
  padding: 5px 10px;
  background: #fff;
  transition: all 400ms;
  color: #000;
}

.publish:hover {
  transform: scale(1.06);
}
.excel {
  color: #000;
  cursor: pointer;
}
.group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.container {
  align-items: flex-start !important;
}
.create-card {
  width: 100%;
  display: flex;
  justify-content: center;
}

.publish {
  border: 1px solid #fff;
  border-radius: 10px;
  width: auto !important;
  padding: 5px 10px;

  transition: all 400ms;
}

.publish:hover {
  transform: scale(1.06);
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 1.7rem;
  color: #fff;
  height: 60vh;
}

.empty img {
  height: 70px;
}
.cross {
  border: 4px dotted var(--mainColor);
  min-height: 290px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

.cross:hover {
  box-shadow: 0 0 10px 0 var(--mainColor);
  transform: scale(105%);
}
.line {
  transform: rotate(0deg) !important;
  width: 20% !important;
}
.line:last-child {
  transform: rotate(90deg) !important;
  display: block;
}
.cross .line:last-child {
  display: block;
}
.row {
  width: 100%;
  height: auto;
}
.cols {
  padding: 10px;
}
.hotel-wrapper {
  padding: 15px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  overflow-y: scroll;
}
.hotel-wrapper::-webkit-scrollbar {
  width: 0;
}
</style>
