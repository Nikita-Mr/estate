<script>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="wrapper-main">
    <div class="container">
      <button class="webBack" @click="$router.go(-1)">
        <img src="/src/assets/img/arrow-down-sign-to-navigate.png" alt="" />
      </button>
      <RouterView />
    </div>
  </div>
</template>

<style>
@media (max-width: 1180px) {
  .webBack {
    display: none;
  }
}
.webBack {
  background: transparent;
  border: none;
  position: absolute;
  left: 0;
}
.webBack:hover {
  filter: brightness(1000%);
}
.webBack img {
  transform: rotate(90deg);
  width: 30px;
}
.accordion-item {
  background: transparent;
  border: none;
}
.accordion-button {
  border: none;
  background: transparent;
  padding: 0;
  color: var(--mainColor);
}
.accordion-button[aria-expanded='true'] {
  background: transparent;
  color: var(--mainColor);
}
.accordion-button[aria-expanded='true'] .card {
  height: auto !important;
}

.accordion-button:focus {
  box-shadow: none;
  border: none;
}
.accordion-button:not(.collapsed)::after {
  background-image: url('../assets/img/arrow-down-sign-to-navigate.png');
}
.accordion-button::after {
  background-image: url('../assets/img/arrow-down-sign-to-navigate.png');
}
img {
  width: auto;
  height: auto;
  border-radius: 5px 5px 0 0;
}
.price {
  font-size: 13px;
}
h5 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/*
.card:hover {
  box-shadow: 0 0 10px 0 var(--mainColor);
  transform: scale(105%);
} */

a {
  width: 70%;
  text-decoration: none;
}
.event {
  width: 100% !important;
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
}
.container {
  min-height: 70%;
  max-height: 600px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
}
.container::-webkit-scrollbar {
  display: none;
}

@media (max-width: 420px) {
  .container {
    display: block;
  }
  .list-events {
    display: block !important;
  }
}

.wrapper-main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 100%;
  z-index: 1;
}
@media (max-width: 450px) {
  .main {
    width: 80%;
  }
}
</style>
