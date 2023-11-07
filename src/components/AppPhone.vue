<script>
import { RouterLink, RouterView } from 'vue-router';

export default {
  components: {},
  data() {},
  methods() {},
  mounted() {},
};
</script>

<template>
  <RouterLink to="/emergency" class="wrapperPhone">Телефоны экстренных служб</RouterLink>
</template>

<style scoped>
.wrapperPhone {
  position: absolute;
  right: 10px;
  bottom: 10px;
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
  line-height: 20px;
  font-size: 15px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
a{
    text-decoration: none;
    color: black;
}
.wrapperPhone:hover {
  filter: brightness(80%);
  transition: filter 200ms;
  cursor: pointer;
}
.wrapperPhone:focus {
  filter: brightness(80%);
  transition: filter 200ms;
  cursor: pointer;
}
</style>
