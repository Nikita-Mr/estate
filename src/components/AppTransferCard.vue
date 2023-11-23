<script>
import { RouterLink, RouterView } from 'vue-router';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
export default {
  props: {
    name: String,
    cityfrom: String,
    cityto: String,
    datefrom: String,
    dateto: String,
    timefrom: String,
    timeto: String,
    typeCar: String,
    car: String,
    passenger: String,
    price: String,
    boardedPlaces: Number,
    passenger2: Number
  },
  components: {},
  data() {
    return {
      passenger2: this.passenger/2
    };
  },
  methods: {
    getDate(data) {
      let date = new Date(data);
      let day = dayjs(date)
      dayjs.locale('ru')
      return day.format(`dd, D MMM`);
    },
  },
  mounted() {},
};
</script>

<template>
  <div class="wrapperTransfer">
    <div class="cardTransfer">
      <div class="wrapinfo">
        <div class="info">
          <div class="time">
            <div class="first">
              <span>{{ timefrom }}</span>
              <span class="sub">{{ getDate(datefrom) }}</span>
            </div>
            <div class="second">
              <span>{{ timeto }}</span>
              <span class="sub">{{ getDate(dateto) }}</span>
            </div>
          </div>
          <div class="line"></div>
          <div class="city">
            <div class="first">
              <span>{{ cityfrom }}</span>
              <span class="sub">Мест: {{ passenger }}</span>
            </div>
            <div class="second">
              <span>{{ cityto }}</span>
              <div class="wrapsvg">
                <div
                  class="circlesvg"
                  :class="{
                    green: boardedPlaces < passenger2 && typeCar == `bus`,
                    green: boardedPlaces < passenger2 && typeCar == `car`,
                  }"
                >
                  <ion-icon name="person"></ion-icon>
                </div>
                <div
                  class="circlesvg"
                  :class="{
                    yellow:
                      boardedPlaces >= passenger2 - 2 &&
                      boardedPlaces <= passenger2 + 2 &&
                      typeCar == `bus`,
                    yellow:
                      boardedPlaces >= passenger2 - 1 &&
                      boardedPlaces <= passenger1 + 1 &&
                      typeCar == `car`,
                  }"
                >
                  <ion-icon name="person"></ion-icon>
                </div>
                <div
                  class="circlesvg"
                  :class="{
                    red:
                      boardedPlaces <= passenger &&
                      boardedPlaces > passenger2 &&
                      typeCar == `bus`,
                    red:
                      boardedPlaces <= passenger &&
                      boardedPlaces > passenger2 &&
                      typeCar == `car`,
                  }"
                >
                  <ion-icon name="person"></ion-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cars">
          <div class="circlesvg">
            <ion-icon name="bus" v-if="typeCar == `bus`"></ion-icon
            ><ion-icon name="car" v-if="typeCar == `car`"></ion-icon>
          </div>
          <span>{{ typeCar == `car` ? name : car }}</span>
        </div>
      </div>
      <div class="wrapprice">
        <div class="price">
          <span v-if="boardedPlaces != passenger">{{ price }}₽</span>
          <span v-if="boardedPlaces == passenger">Нет мест</span>
          <span v-if="boardedPlaces != passenger" class="sub discount"
            >{{ price - 1000 }}₽</span
          >
        </div>
        <div class="content">
          <img src="" alt="" />
          <img src="" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.time {
  width: 70px;
}
.city {
  width: min-content;
}
.cardTransfer {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  box-shadow: 0px 0px 10px 0px #2b2b2b;
  transition: all 150ms linear;
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
}
.cardTransfer:hover {
  box-shadow: 0px 5px 15px 0px #2b2b2b;
  transform: translateY(-3px);
}
.info {
  display: flex;
  height: 100px;
  margin-bottom: 10px;
  min-width: 230px;
}
.first span {
  width: 100%;
}
.first {
  height: 50%;
  display: flex;
  flex-wrap: wrap;
}
.sub {
  font-size: 13px;
  display: inline-block;
}
span:not(.sub, .cars span) {
  font-weight: 600;
  display: grid;
}
.line {
  transform: rotate(90deg);
  align-self: center;
  margin-bottom: 25px;
  left: -10px;
  max-width: 40px;
  background: black;
  position: relative;
}
.line::after {
  content: " ";
  position: absolute;
  top: -4px;
  left: -10px;
  width: 10px;
  height: 10px;
  background: transparent;
  border: 2px solid #000;
  border-radius: 100%;
}
.line::before {
  content: " ";
  position: absolute;
  bottom: -4px;
  left: 100%;
  width: 10px;
  height: 10px;
  background: transparent;
  border: 2px solid #000;
  border-radius: 100%;
}
.wrapsvg {
  width: 100%;
  display: flex;
  gap: 5px;
}
.circlesvg {
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background: #dedede;
}
.cars {
  display: flex;
  align-items: center;
  gap: 10px;
}
.cars .circlesvg {
  width: 30px;
  height: 30px;
}
.price {
  font-size: 15px !important;
}
.price .sub {
  text-align: end;
  text-decoration: line-through;
  text-decoration-thickness: 1.3px;
  text-decoration-color: #3b3b3b;
}
.green {
  background: #5cd166;
}
.yellow {
  background: #ffcd57;
}
.red {
  background: #ee2e31;
}
</style>
