<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
  components: {
  },
  data() {

  },
  methods() {

  },
  mounted() {

  }
}
</script>

<template>
  <ul class="list-events">
    <li class="item-event">
      <RouterLink to="/info">
      <div class="event">
        Инфо
      </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/transfer-taksi">
      <div class="event">
        Трансфер/Такси
      </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/habitation">
      <div class="event">
        Проживание
      </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/rental">
      <div class="event">
        Прокат
      </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/forChildren">
      <div class="event">
        Детям
      </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/instructor-tours">
      <div class="event">
        Инструктор/Туры
      </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/events">
      <div class="event">
        Развлечения
      </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/news">
      <div class="event">
        Новости
      </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/ads">
      <div class="event">
        Объявления
      </div>
      </RouterLink>
    </li>
  </ul>
</template>

<style scoped>
.list-events {
  width: 100%;
  height: 500px;
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.item-event {
  cursor: pointer;
  margin-bottom: 10px;
  background-color: transparent;
  flex-basis: 33%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.event {
  text-align: center;
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 125px;
  font-size: large;
  font-weight: 550;
  padding: 7px 10px;
  color: #d5d5d5;
  border: 1px solid #d5d5d5;
  box-shadow: 0px 0 10px 0 #ffffff71;
  border-radius: 15px;
  transition: color 400ms, border 400ms;
}

.event:hover {
  border: 1px solid black;
  color: black;
}
@media (max-width: 670px) {
  .event {
    text-align: center;
    width: 85%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-size: medium;
    font-weight: 550;
    padding: 7px 10px;
    color: #d5d5d5;
    border: 1px solid #d5d5d5;
    box-shadow: 0px 0 10px 0 #ffffff71;
    border-radius: 15px;
  }
}

@media (max-width: 507px) {
  .item-event {
    cursor: pointer;
    margin-bottom: 10px;
    background-color: transparent;
    flex-basis: 47%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .list-events{
    display: block;
    overflow-y: scroll;
  }
}
</style>
