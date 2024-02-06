<script>
import axios from "axios";
import { RouterLink, RouterView } from "vue-router";
import AppCard from "/src/components/AppCard.vue";
import AppTransferCard from "/src/components/AppTransferCard.vue";
import { months } from "dayjs/locale/ru";

export default {
  components: {
    AppCard,
    AppTransferCard,
  },
  data() {
    return {
      date: "",
      admin: false,
      Transfer: [],
      cityfrom: "",
      cityto: "",
      datefrom: new Date().toLocaleDateString("en-CA"),
      passenger: 1,
      message: ``,
      id: "",
      cal: false,
      month: [],
      transfers_day: [],
      inputDate: ''
    };
  },
  methods: {
    async find() {
      let response = await axios.post(`/filter`, {
        cityfrom: this.cityfrom,
        cityto: this.cityto,
        datefrom: this.datefrom,
        passenger: this.passenger,
        namefilter: "transfer",
      });
      this.Transfer = response.data.Array;
      this.message = response.data.message;
    },

    async check_admin() {
      this.id = this.getCookieValue("id");
      let response = await axios.post(`/check_admin`, {
        id: this.id,
      });
      this.admin = response.data.admin;
    },

    async transferLoad() {
      let response = await axios.post(`/transfer`);
      // this.Transfer = response.data.transfer;
    },

    show_day(s) {
      let arr = s.split("-");
      s = arr.reverse().join(".");
      return s;
    },

    async calendar() {
      let today = new Date();
      this.month = [];
      this.cal = true;
      for (let i = 0; i < 32; i++) {
        let date = new Date(today);
        date.setDate(today.getDate() + i);
        this.month.push(date.toISOString().slice(0, 10));
      }
      let response = await axios.post(`/transfer_days`, {
        cityfrom: this.cityfrom,
        cityto: this.cityto,
        month: this.month,
      });
      let days = response.data.days;
      this.Transfer = days
      if (days) {
        this.transfers_day = [];
        let day = {
          count: 0,
          date: "",
          average_price: 0,
          transfers: []
        };
        let lastDay = {
          datefrom: "",
        };
        for (let i = 0; i < days.length; i++) {
          let transfer = days[i];
          if (transfer.datefrom == lastDay.datefrom) {
            day.count += 1;
            day.average_price = Math.floor(
              (lastDay.price_sit + transfer.price_sit) / day.count
            );
            day.transfers.push(transfer)
          } else {
            if (day.count > 0) {
              this.transfers_day.push(day)
            }
            day = {
              count: 1,
              date: transfer.datefrom,
              average_price: transfer.price_sit,
              transfers: [transfer]
            };
          }
          if (i == days.length - 1) {
            this.transfers_day.push(day)
          }
          lastDay = transfer
        }
      }
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

    subDate(date) {
      this.inputDate = date
      this.Transfer = this.transfers_day.filter(obj => obj.date == date)[0].transfers
      console.log(this.Transfer)
    }
  },
  mounted() {
    this.check_admin();
    this.transferLoad();
  },
};
</script>

<template>
  <div class="wrapper">
    <div class="create-transfer" v-if="id">
      <RouterLink to="/create-transfer" class="publish">Опубликовать поездку</RouterLink>
    </div>
    <div class="wrapper-for-form">
      <div class="form">
        <form class="form" @submit.prevent="find">
          <div class="input-group">
            <input v-model="cityfrom" type="text" placeholder="Откуда" />
            <input v-model="cityto" type="text" placeholder="Куда" />
            <!-- <input v-model="datefrom" type="date" /> -->
            <input
              @click="calendar"
              type="text"
              placeholder="Календарь поездок"
              v-model="inputDate"
            />
            <input v-model="passenger" type="number" min="1" />
            <button class="btn btn-primary" type="submit">Поиск</button>
          </div>
          <div class="cal" v-if="cal">
            <div tabindex="0" @click="subDate(day.date, i)" v-for="day in this.transfers_day" class="day">
              <span>{{ show_day(day.date) }}</span>
              <span>Поездок в этот день - {{ day.count }}</span>
              <span>Средняя цена билета - {{day.average_price}} руб.</span>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div v-if="Transfer.length == 0 || !Transfer" class="empty">
      <img src="../../assets/img/search.png" alt="" /><span>Пусто</span>
    </div>
    <div class="transfer-card-wrapper">
      <div class="cards" v-if="Transfer">
        <app-transfer-card
          @click="
            $router.push({ path: `/transfer/card`, query: { id: card.id } })
          "
          v-for="(card, index) in Transfer"
          :i="index"
          :name="card.name"
          :cityfrom="card.cityfrom"
          :cityto="card.cityto"
          :datefrom="card.datefrom"
          :length="card.length"
          :timefrom="card.timefrom"
          :typeCar="card.typeCar"
          :car="card.car"
          :passenger="card.passenger"
          :passenger2="card.passenger / 2"
          :price_sit="card.price_sit"
          :price_salon="card.price_salon"
          :boardedPlaces="card.boardedPlaces"
          :img="card.img"
        >
        </app-transfer-card>
        <h1 v-if="message">{{ message }}</h1>
      </div>
    </div>

    <div class="transfers"></div>
  </div>
</template>

<style scoped>
.cal {
  width: 70%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border-radius: 15px;
  gap: 7px;
}

.day {
  background-color: #F4EDED;
  box-shadow: 0px 0px 5px 0px #F4EDED;
  flex: 25%;
  color: black;
  font-weight: 500;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  max-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  transition: all 500ms;
}

.day:active, .day:focus, .day:hover {
  background: transparent;
  color: #fff;
}

.day span {
  font-weight: 600;
  font-size: smaller;
  text-align: center;
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 1.7rem;
  color: #fff;
}

.empty img {
  height: 70px;
}
.cards {
  width: 80%;
  padding: 10px;
  height: 250px;
  overflow-y: scroll;
  gap: 30px;
  display: grid;
}
.cards::-webkit-scrollbar {
  display: none;
}
.transfer-card-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}
.transfers {
  width: 100%;
}

input:focus {
  border: none;
  outline: 1px solid;
  box-shadow: none;
}

input[type="number"] {
  width: 5%;
}

.input-group {
  display: flex;
  align-items: center;
  justify-content: center;
}

form {
  top: 2%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}

.btn-primary {
  border-radius: 10px;
}

form input {
  padding: 5px 7px;
  background-color: #fff;
  border: 1px solid var(--mainColor);
  border-radius: 10px;
  box-shadow: 0px 0px 5px 0px #d5d5d5;
  color: #7c7c7c !important;
}

input:not(:first-child) {
}

button {
  box-shadow: 0 0 10px #d5d5d5;
  color: #000;
  background: #d5d5d5;
  border: none;
}

button:hover {
  box-shadow: none;
}

input:hover {
  box-shadow: none;
}

input:focus {
  box-shadow: none;
}

input::placeholder {
}

.wrapper {
  width: 100%;
  height: 70vh;
  display: grid;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 25px;
}

.title {
  width: 100%;
  text-align: center;
  color: var(--mainColor);
  font-size: large;
  font-weight: 600;
}

.create-transfer {
  width: 100%;
  display: flex;
  justify-content: center;
}

.create-transfer a {
  transition: all 500ms ease;
}

.create-transfer a:hover {
  scale: 1.06;
}

.wrapper-for-form {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 770px) {
  .input-group {
    flex-direction: column;
    width: 95%;
  }

  .input-group input,
  .input-group button {
    width: 100%;
    border-radius: 0;
  }

  .cards {
    width: 93%;
    margin: 5px;
  }
  
  .day span {
    font-size: 10px;
  }

  .cal {
    padding: 2px;
  }

  .wrapper {
    overflow-y: scroll;
    overflow-x: hidden;
  }
}

@media (max-height: 780px) {
  .wrapper {
    display: grid;
    overflow-y: scroll;
    overflow-x: hidden;
    width: 80%;
  }

  .title {
    display: none;
  }
}

@media (max-width: 480px) {
  form input {
    padding: 2px;
  }

  .btn {
    padding: 2px;
  }

  .empty {
    font-size: 1.5rem;
  }

  .empty img {
    height: 50px;
  }

  .cards {
    padding: 2px;
  }
}

@media (max-height: 710px) {
  .wrapper {
    height: 60vh;
  }
}

@media (max-height: 680px) {
  .wrapper {
    width: 100%;
  }
}
</style>
