<script>
import axios from 'axios';
import { RouterLink, RouterView } from 'vue-router';

export default {
  components: {},
  data() {
    return {

    }
  },
  methods: {

  },
  mounted() {
  },
};
</script>

<template>
  <ul class="list-events">
    <li class="item-event">
      <RouterLink to="/habitation/items?name=hotels">
        <div class="event">Гостиницы</div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/habitation/items?name=cottage">
        <div class="event">
          Коттеджи <br />
          Дома <br />
          Шале
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/habitation/items?name=flat">
        <div class="event">Квартиры</div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/habitation/items?name=rooms">
        <div class="event">Комнаты</div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/habitation/items?name=hostel">
        <div class="event">Хостел</div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/habitation/items?name=longterm">
        <div class="event">На длительный срок</div>
      </RouterLink>
    </li>
  </ul>
</template>

<style scoped>
.list-events {
  width: 80%;
  height: 100%;
  list-style-type: none;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
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

@media (max-width: 995px) {
  .item-event {
    line-height: 1;
    font-size: 13px;
    cursor: pointer;
    margin-bottom: 10px;
    background-color: transparent;
    flex-basis: 47%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

@media (max-width: 670px) {
  .event {
    text-align: center;
    width: 85%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-size: 13px;
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
}
</style>
