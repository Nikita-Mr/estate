<script>
import { RouterLink, RouterView } from 'vue-router';
import AppNav from './components/AppNav.vue';
import AppSlider from './components/AppSlider.vue';
import AppCenter from './components/AppCenter.vue';
import AppPhone from './components/AppPhone.vue';
import AppAdmin from './views/admin/AppAdmin.vue';
import axios from 'axios';
// axios.defaults.headers.common['Authorization'] = document.cookie.replace("token=", ``).split(`;`, 1)

export default {
  components: {
    AppNav,
    AppSlider,
    AppCenter,
    AppPhone,
    AppAdmin
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
  methods: {
    async notifications() {
      let response = await axios.post(`/notifications`, {
        nameModel: "ALL",
      });

      this.s = response.data.s;
    },
  },
  mounted() {},
};
</script>

<template>
  <app-nav></app-nav>
  <app-slider></app-slider>
  <app-center></app-center>
  <div class="wrapperBottom">
    <app-admin class="appAdmin">
      <div v-if="s" class="alert">
        {{ s }}
      </div>
    </app-admin>
    <app-phone></app-phone>
  </div>
</template>

<style>

.appAdmin {
  position: relative;
}
.alert {
  position: absolute;
  top: 5%;
  right: 3%;
  padding: 2px;
  color: red;
  border: 1px solid red;
  border-radius: 100%;
  height: 25px;
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: #ffffff !important;
  transition: background-color 5000s ease-in-out 0s !important;
  box-shadow: inset 0 0 20px 20px #23232300 !important;
}

.wrapperBottom {
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 10px;
}

/* input{
  color: #ffffff !important; 
} */
</style>
