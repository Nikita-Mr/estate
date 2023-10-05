<script>
import { RouterLink, RouterView } from 'vue-router';

export default {
  data() {
    return {
      today: new Date().toLocaleDateString('en-CA'),
      date: ''
    }
  },
  methods: {
    find(e){
      e.preventDefault();
    },
  },
  mounted() {},
};
</script>

<template>
  <div class="wrapper">
    <div class="title mb-3">Трансфер</div>
    <form class="form" @submit="find">
      <div class="input-group">
        <input type="text" placeholder="Откуда" />
        <input type="text" placeholder="Куда" />
        <input type="date" :value="today"/>
        <input type="number" value="1" min="1" />
        <button class="btn btn-primary" type="submit">Поиск</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
input:focus{
  border: none;
  outline: 1px solid;
  box-shadow: none;
}
input[type="number"]{
  width: 5%;
}
.input-group{
  justify-content: center;
}
form {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}


.btn-primary {
  border-radius: 10px;
}

form input {
  padding: 5px 7px;
  background-color: #FFF;
  border: 1px solid var(--mainColor);
  border-radius: 10px;
  box-shadow: 0px 0px 5px 0px #d5d5d5;
  color: #7c7c7c;
}
input:not(:first-child){
}
button{
  box-shadow: 0 0 10px #d5d5d5;
  color: #000;
  background: #d5d5d5;
  border: none;
}
button:hover{
  box-shadow: none;
}
input:hover{
  box-shadow: none;
}
input:focus{
  box-shadow: none;
}
input::placeholder {
}
.wrapper {
  width: 100%;
  align-self: start;
}
.title {
  width: 100%;
  text-align: center;
  color: var(--mainColor);
  font-size: large;
  font-weight: 600;
}
</style>
