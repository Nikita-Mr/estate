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
      list: [],
      weatherDays: [],
    };
  },
  methods: {
    async loadWeather() {
      await axios
        .get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${
            !this.find ? 'Шерегеш' : this.find
          }&lang=ru&units=metric&appid=309ce2e3109b0cdf1a61910a9719cee0`
        )
        .then((res) => {
          this.list = res.data.list.slice(0, 11);
          /* this.weather = res.data.main.temp; this.alerts = res.data.weather[0].description; this.icon = res.data.weather[0].icon;*/ console.log(
            res.data.list.slice(0, 10)
          );
        });
    },
    days(day) {
      // if (day < 1) {
      //   return 'Сегодня';
      // }
      // if (day > 0 && day < 4) {
      //   return '3 дня';
      // }
    },
    weatherdays(e) {
      if (e == 1) {
        this.weatherDays = this.list.slice(0, 1);
      }
      if (e == 3) {
        this.weatherDays = this.list.slice(1, 4);
      }
      if (e == 7) {
        this.weatherDays = this.list.slice(4, 11);
      }
    },
  },
  mounted() {
    this.loadWeather();
    this.weatherdays(1)
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
    <span class="city">{{ !find ? 'Шерегеш' : find }}</span>
    <div class="wrapp">
      <button class="nav" @click="weatherdays(1)">Сегодня</button>
      <button class="nav" @click="weatherdays(3)">3-дня</button>
      <button class="nav" @click="weatherdays(7)">7-дня</button>
    </div>
    <div class="wrapper">
      <div class="card" v-for="(item, i) in weatherDays">
        <div class="icon">
          <img
            :src="
              `https://openweathermap.org/img/wn/` +
              item.weather[0].icon +
              `@2x.png`
            "
            alt=""
          />
        </div>
        <div class="card-title">
          <span class="weather">{{ item.main.temp }}°C</span>
          <span class="title">{{ alerts }}</span>
          <span class="days">{{ days(i) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapp {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
.nav {
  padding: 0 10px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: #fff;
}
.nav:focus {
  filter: brightness(80%);
  transition: filter 200ms;
  cursor: pointer;
}

.city {
  color: #d5d5d5;
  display: inline-block;
  width: 100%;
  text-align: center;
}
.wrapper {
  display: flex;
  gap: 50px;
  overflow-x: scroll;
  padding: 10px 10px;
  height: 300px;
}
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
  min-width: 300px;
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
