<script>
import { RouterLink, RouterView } from 'vue-router';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

export default {
  data() {
    return {
      weather: ``,
      alerts: ``,
      time: ``,
      icon: ``,
      find: ``,
      list: [],
      weatherDay: [],
      hour: [],
      index: 0,
    };
  },
  methods: {
    async loadWeather() {
      await axios
        .get(
          `http://api.weatherapi.com/v1/forecast.json?lang=ru&key=7b48837a60794ba2a7c193829232511&days=10&aqi=no&alerts=no&q=${
            !this.find ? 'Шерегеш' : this.find
          }`
        )
        .then((res) => {
          this.list = res.data.forecast.forecastday;
          /* this.weather = res.data.main.temp; this.alerts = res.data.weather[0].description; this.icon = res.data.weather[0].icon;*/
          console.log(this.list);
          console.log(res.data);
          this.weatherDays = res.data;
        });
    },
    getDate(data) {
      let date = new Date(data);
      let day = dayjs(date);
      dayjs.locale('ru');
      return day.format(`dd, D MMM`);
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
        this.weatherDay = this.list.slice(0, 1);
      }
      if (e == 3) {
        this.weatherDay = this.list.slice(0, 3);
      }
      if (e == 7) {
        this.weatherDay = this.list.slice(0, 7);
      }
      if (e == 10) {
        this.weatherDay = this.list.slice(0, 9);
      }
    },
    hours(weatI) {
      this.hour = [];
      for (let i = 0; i < this.weatherDay[weatI].hour.length; i += 3) {
        // console.log(this.weatherDay[weatI].hour[i])
        this.hour.push(this.weatherDay[weatI].hour[i]);
      }
    },
  },
  mounted() {
    this.loadWeather();
    this.weatherdays(1);
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
      <button class="nav" @click="weatherdays(7)">7-дней</button>
      <button class="nav" @click="weatherdays(10)">10-дней</button>
    </div>
    <div class="wrapper">
      <!-- <div class="card" v-if="weatherDay < 0">
        <div class="icon">
          <img :src="weatherDay.day.condition.icon" alt="" />
        </div>
        <div class="card-title">
          <span class="weather">{{ weatherDay.day.mintemp_c }}°C</span>
          <span class="title">{{ weatherDay.day.condition.text }}</span>
          <span class="days">{{ getDate(weatherDay.date) }}</span>
        </div>
      </div> -->
      <div class="card" @click="hours(i), index = i" v-for="(item, i) in weatherDay">
        <div class="icon">
          <img :src="item.day.condition.icon" alt="" />
        </div>
        <div class="card-title">
          <span class="weather">{{ item.day.mintemp_c }}°C</span>
          <span class="title">{{ item.day.condition.text }}</span>
          <span class="days">{{ getDate(item.date) }}</span>
        </div>
      </div>
      
      <div class="hour">
        <hr>
        <!-- <h2>{{ getDate(weatherDay[index].date) }}</h2> -->
        <div class="wrapper_hour">
          <div class="card" v-for="(item, i) in hour">
            <div class="icon">
              <img :src="item.condition.icon" alt="" />
            </div>
            <div class="card-title">
              <span class="weather">{{ item.temp_c }}°C</span>
              <span class="title">{{ item.condition.text }}</span>
              <span class="days">{{ item.time.slice(11) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper_hour {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 25px;
}
.hour h2{
  text-align: center;
  color: #d5d5d5;
}
.hour .card{
  width: 150px;
  font-size: 12px;
}
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
  align-items: start;
  overflow-x: scroll;
  padding: 15px 10px;
  height: 300px;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 22px;
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
  max-width: 200px;
  width: 100%;
  height: 30%;
  background-color: transparent;
  border: none;
  color: #d5d5d5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  cursor: pointer;
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
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 100%;
  box-shadow: 0px 0 10px 0 #fff;
  background-color: #ffffff80;
}
.weather {
  font-size: 18px;
}

</style>
