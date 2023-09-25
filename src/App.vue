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
       window.location.assign(`http://localhost:5173`)

      },
    };
  },
  watch(){
    this.reload()
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

<style scoped></style>
