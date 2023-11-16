<script>
import { RouterLink, RouterView } from 'vue-router';
import axios from 'axios';

export default {
  data() {
    return {
      weather: ``,
      alerts: ``,
      time: ``,
      icon: ``,
      find: ``,
    };
  },
  methods: {
    async loadWeather() {
      await axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${
            !this.find ? 'Шерегеш' : this.find
          }&lang=ru&units=metric&appid=309ce2e3109b0cdf1a61910a9719cee0`
        )
        .then((res) => {
          this.weather = res.data.main.temp; this.alerts = res.data.weather[0].description; this.icon = res.data.weather[0].icon; console.log(
            res
          );
        });
    },
  },
  mounted() {
    this.loadWeather();
  },
};
</script>

<template>
  <div class="weather-wrapper">
    <div class="wrapper-input">
      <input
        @keyup.enter="loadWeather"
        v-model="find"
        type="text"
        placeholder="Шерегеш"
      />
      <button @click="loadWeather" type="submit">Поиск</button>
    </div>
    <div class="card">
      <span class="city">{{ !find ? 'Шерегеш' : find }}</span>
      <div class="icon">
        <img
          :src="`https://openweathermap.org/img/wn/` + icon + `@2x.png`"
          alt=""
        />
      </div>
      <div class="card-title">
        <span class="weather">{{ weather }}°C</span>
        <span class="title">{{ alerts }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper-input {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper-input button {
  border: none;
  border-radius: 0 10px 10px 0;
  padding: 1.5px 8px;
  box-shadow: 0 0 10px #d5d5d5;
}
.wrapper-input input {
  border: none;
  border-radius: 10px 0 0 10px;
  padding: 1.5px 10px;
  box-shadow: 0 0 10px #d5d5d5;
}
.wrapper-input input:focus {
  box-shadow: none;
  outline: none;
}
.wrapper-input button:hover {
  box-shadow: none;
}
.weather-wrapper {
  width: 100%;
  height: 100%;
}
.card {
  width: 400px;
  height: 100%;
  background-color: transparent;
  border: none;
  color: #d5d5d5;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}
.city {
  font-size: 40px;
}
.card-title span {
  display: block;
  text-align: center;
}
.icon {
  text-align: center;
}
.icon img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 100%;
  box-shadow: 0px 0 10px 0 #fff;
  background-color: #ffffff80;
}
.weather {
  font-size: 30px;
}
</style>
