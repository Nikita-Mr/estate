<script>
import axios from "axios";
import { RouterLink, RouterView } from "vue-router";
import AppCard from "/src/components/AppCard.vue";
import AppTransferCard from "/src/components/AppTransferCard.vue";

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
      this.admin = response.data.admin;
    },

    async check_admin() {
      let response = await axios.post(`/check_admin`, {
        id: this.getCookieValue("id"),
      });
      this.admin = response.data.admin;
    },

    async transferLoad() {
      let response = await axios.post(`/transfer`);
      // this.Transfer = response.data.transfer;
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
  },
  mounted() {
    this.check_admin();
    this.transferLoad();
  },
};
</script>

<template>
  <div class="wrapper">
    <div class="wrapper-for-form">
      <div class="form">
        <div class="title mb-3">Трансфер</div>
        <form class="form" @submit.prevent="find">
          <div class="input-group">
            <input v-model="cityfrom" type="text" placeholder="Откуда" />
            <input v-model="cityto" type="text" placeholder="Куда" />
            <input v-model="datefrom" type="date" />
            <input v-model="passenger" type="number" min="1" />
            <button class="btn btn-primary" type="submit">Поиск</button>
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
          :dateto="card.dateto"
          :timefrom="card.timefrom"
          :timeto="card.timeto"
          :typeCar="card.typeCar"
          :car="card.car"
          :passenger="card.passenger"
          :passenger2="card.passenger / 2"
          :price="card.price"
          :boardedPlaces="card.boardedPlaces"
        >
        </app-transfer-card>
        <h1 v-if="message">{{ message }}</h1>
      </div>
    </div>

    <div class="transfers"></div>
    <div class="create-transfer">
      <RouterLink to="/create-transfer">Опубликовать поездку</RouterLink>
    </div>
  </div>
</template>

<style scoped>
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
  display: flex;
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
  position: absolute;
  bottom: 2% !important;
  width: 100%;
  display: flex;
  justify-content: center;
}

.create-transfer a {
  width: fit-content !important;
  padding: 5px 10px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid var(--mainColor);
  color: var(--mainColor);

  transition: scale 500ms;
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
  }

  .input-group input,
  .input-group button {
    width: 100%;
    border-radius: 0;
  }

  .cards {
    width: 93%;
  }
}

@media (max-height: 780px) {
  .wrapper {
    overflow-y: scroll;
    overflow-x: hidden;
    width: 80%;
    padding-top: 150px;
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
    padding-top: 165px !important;
    width: 100%;
  }
}
</style>
