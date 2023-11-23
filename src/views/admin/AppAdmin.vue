<script>
import { RouterLink, RouterView } from "vue-router";

export default {
  components: {},
  data() {},
  methods() {},
  mounted() {},
};
</script>

<template>
  <RouterLink to="/admin/sections" class="wrapperAdmin">Запросы</RouterLink>
</template>

<style scoped>
.wrapperAdmin {
  background-image: url('../../icons/textWrapper.svg');
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
  line-height: 20px;
  font-size: 15px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.wrapperITEM {
  position: absolute;
  right: 300px;
  bottom: 10px;
  background-image: url("../icons/textWrapper.svg");
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
  line-height: 20px;
  font-size: 15px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

a {
  text-decoration: none;
  color: black;
}
.wrapperAdmin:hover {
  filter: brightness(80%);
  transition: filter 200ms;
  cursor: pointer;
}
.wrapperAdmin:focus {
  filter: brightness(80%);
  transition: filter 200ms;
  cursor: pointer;
}
</style>
