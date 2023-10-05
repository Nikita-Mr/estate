<script>
import { RouterLink, RouterView } from 'vue-router';

export default {
  props: {
    cityfrom: String,
    cityto: String,
    timefrom: String,
    timeto: String,
    walkfrom: String,
    walkto: String,
    cars: String,
    price: String,
  },
  components: {},
  data() {
    return {};
  },
  methods: {},
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
              <span>15:00</span>
              <span class="sub">15 ч 15</span>
            </div>
            <div class="second">
              <span>06:10</span>
              <span class="sub">+1</span>
            </div>
          </div>
          <div class="line"></div>
          <div class="city">
            <div class="first">
              <span>Москва</span>
              <div class="wrapsvg">
                <div class="circlesvg"><ion-icon name="walk"></ion-icon></div>
                <div class="circlesvg yellow">
                  <ion-icon name="walk"></ion-icon>
                </div>
                <div class="circlesvg"><ion-icon name="walk"></ion-icon></div>
              </div>
            </div>
            <div class="second">
              <span>Казань</span>
              <div class="wrapsvg">
                <div class="circlesvg green">
                  <ion-icon name="walk"></ion-icon>
                </div>
                <div class="circlesvg"><ion-icon name="walk"></ion-icon></div>
                <div class="circlesvg"><ion-icon name="walk"></ion-icon></div>
              </div>
            </div>
          </div>
        </div>
        <div class="cars">
          <div class="circlesvg"><ion-icon name="bus"></ion-icon></div>
          <span>Intercars</span>
        </div>
      </div>
      <div class="wrapprice">
        <div class="price">
          <span>1 295₽</span>
          <span class="sub discount">1 890₽</span>
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
  width: 35%;
  background: black;
  position: relative;
}
.line::after {
  content: ' ';
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
  content: ' ';
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
  justify-content: space-evenly;
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
  background: #f58b00;
}
</style>
