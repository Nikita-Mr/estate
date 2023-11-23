<script>
import { RouterLink, RouterView } from 'vue-router';

export default {
  data() {
    return {
      active: 0,
      token: document.cookie 
    };
  },
  methods: {
    click() {
      this.active == 1 ? (this.active = 0) : (this.active = 1);
    },
    close() {
      if (this.active == 1) {
        this.active = 0;
      }
    },
  },
  watch:{
    token(newtoken, old){
      if (newtoken.includes('token=')) {
        this.token = newtoken
      }
    }
  }
};
</script>

<template>
  <div class="wrapper-for-nav">
    <button class="webBack" id="webBack" @click="$router.go(-1)">
      <img src="/src/assets/img/arrow-down-sign-to-navigate.png" alt="" />
    </button>
    <button @click="click" class="burger" :class="{ cross: active == 1 }">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </button>
    <nav>
      <ul class="list-nav" :class="{ active: this.active == 1 }">
        <RouterLink to="/" @click="active = 0">
          <li class="list-item-nav"><img src="../assets/img/logo.png" /></li
        ></RouterLink>
        <RouterLink to="/weather" @click="active = 0">
          <li class="list-item-nav">Погода</li></RouterLink
        >
        <RouterLink to="/habitation" @click="active = 0">
          <li class="list-item-nav">Забронировать место</li></RouterLink
        >
        <RouterLink to="/transfer" @click="active = 0">
          <li class="list-item-nav">Забронировать трансфер</li></RouterLink
        >
        <RouterLink to="/search" @click="active = 0">
          <li class="list-item-nav">Поиск</li></RouterLink
        >
        <RouterLink to="/register" @click="active = 0">
          <li v-if="!token" class="list-item-nav">
            Регистрация/Вход
          </li>
          <li v-if="token" class="profile">
            <ion-icon name="person-outline"></ion-icon>
          </li>
        </RouterLink>
      </ul>
    </nav>
  </div>
</template>

<style>
a{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
}
@media (max-width: 1180px) {
  #webBack {
    display: block !important;
  }
}
.profile{
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('../assets/img/elipse.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 100%;
}
ion-icon{
  height: 50px;
  width: 30px;
}
#webBack {
  display: none;
}
.bg {
  position: absolute;
  top: 0;
  left: 0;
  background-image: url('../assets/img/bg.jpg');
  width: 100%;
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: brightness(60%);
}
nav {
  z-index: 10;
}
.burger {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5.2px;
  width: 40px;
  height: 40px;
  background-color: transparent;
  display: none;
  border: none;
}
.line {
  width: 100%;
  height: 2px;
  background-color: #fff;
}

.wrapper-for-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
}
.list-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  list-style-type: none;
}
.list-nav a {
  color: black;
  text-decoration: none;
}

.list-item-nav {
  background-image: url('../icons/textWrapper.svg');
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 175px;
  height: 70px;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.7px;
  font-size: 15px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.list-nav a:focus .list-item-nav {
  filter: brightness(80%);
}
.list-item-nav img {
  width: 70px;
  height: 70px;
}

.active {
  flex-direction: column;
  display: flex !important;
  position: absolute;
  top: calc(50% - 260px);
  right: 10px;
  z-index: 1;
}

.cross {
  gap: 0;
  position: relative;
}
.cross .line:last-child {
  display: none;
}
.cross .line:nth-child(1) {
  transform: rotate(45deg);
  position: absolute;
  width: 80%;
}

.cross .line:nth-child(2) {
  transform: rotate(-45deg);
  position: absolute;
  width: 80%;
}

.list-item-nav:hover {
  filter: brightness(80%);
  transition: filter 200ms;
  cursor: pointer;
}

body {
  font-family: 'Poppins', sans-serif;
}

@media (max-width: 1310px) {
  .list-nav {
    gap: 10px;
  }
}
@media (max-width: 1180px) {
  .burger {
    display: flex;
    align-self: start;
  }
  .list-nav {
    display: none;
  }
  .wrapper-for-nav {
    justify-content: end;
    gap: 10px;
  }
}
</style>
