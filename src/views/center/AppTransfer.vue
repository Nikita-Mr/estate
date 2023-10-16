<script>
import axios from 'axios';
import { RouterLink, RouterView } from 'vue-router';
import AppCard from '/src/components/AppCard.vue';
import AppTransferCard from '/src/components/AppTransferCard.vue';

export default {
  components: {
    AppCard,
    AppTransferCard,
  },
  data() {
    return {
      date: '',
      admin: false,
      Transfer: [],
      cityfrom: '',
      cityto: '',
      datefrom: new Date().toLocaleDateString('en-CA'),
      passenger: 1,
      message: ``,
    };
  },
  methods: {
    async find() {
      let response = await axios.get(`/filter`, {
        params: {
          cityfrom: this.cityfrom,
          cityto: this.cityto,
          datefrom: this.datefrom,
          passenger: this.passenger,
          namefilter: 'transfer',
        },
      });
      this.Transfer = response.data.filter;
      this.message = response.data.message;
    },
    async transferLoad() {
      let response = await axios.get(`/transfer`, {
        headers: {
          Authorization: document.cookie.replace('token=', ``),
        },
      });
      this.Transfer = response.data.transfer;
      this.admin = response.data.admin;
    },
  },
  mounted() {
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
    <div class="transfer-card-wrapper">
      <div class="cards">
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
          :price="card.price"
          :boardedPlaces="card.boardedPlaces"
        >
        </app-transfer-card>
        <h1 v-if="message">{{ message }}</h1>
      </div>
    </div>

    <div class="transfers"></div>
    <div v-if="admin" class="create-transfer">
      <RouterLink to="/create-transfer">Опубликовать поездку</RouterLink>
    </div>
  </div>
</template>

<style scoped>
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
}
.transfers {
  width: 100%;
}

input:focus {
  border: none;
  outline: 1px solid;
  box-shadow: none;
}

input[type='number'] {
  width: 5%;
}

.input-group {
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
  color: #7c7c7c;
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
  bottom: 2%;
  width: 100%;
  display: flex;
  justify-content: center;
}

.create-transfer a {
  width: fit-content;
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
  left: 0;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
