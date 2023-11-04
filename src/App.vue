<script>
import { RouterLink, RouterView } from 'vue-router';
import AppNav from './components/AppNav.vue';
import AppSlider from './components/AppSlider.vue';
import AppCenter from './components/AppCenter.vue';
import AppPhone from './components/AppPhone.vue';
import axios from 'axios';
// axios.defaults.headers.common['Authorization'] = document.cookie.replace("token=", ``).split(`;`, 1)

export default {
  components: {
    AppNav,
    AppSlider,
    AppCenter,
    AppPhone,
  },
  data() {
    return {
      reload() {
        window.location.assign(`http://localhost:5173`);
        Vue.config.silent = true;
      },
    };
  },
  watch() {
    this.reload();
  },
  methods() {},
  mounted() {},
};
</script>

<template>
  <app-nav></app-nav>
  <app-slider></app-slider>
  <app-center></app-center>
  <app-phone></app-phone>
</template>

<style>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: #ffffff !important;
  transition: background-color 5000s ease-in-out 0s !important;
  box-shadow: inset 0 0 20px 20px #23232300 !important;
}
/* input{
  color: #ffffff !important; 
} */
</style>
