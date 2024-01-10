<script>
import { RouterLink, RouterView } from 'vue-router';
import axios, { AxiosError } from 'axios';

export default {
  components: {},
  data() {
    return {
      username: '',
      surname: '',
      email: '',
      number: '+7',
      password: '',
      error: '',
      status: 0,
    };
  },
  methods: {
    async submit() {
      let error = await axios.post(`/registration`, {
        username: this.username,
        surname: this.surname,
        email: this.email,
        number: this.number,
        password: this.password,
      });
      this.error = error.data.message;
      this.status = error.data.status;
      setTimeout(() => {
        if (this.status == '200') {
          this.$refs.form.reset();
          document.cookie = new String();
          document.cookie = `token=${this.token}; max-age=1123200`;

          this.$router.push({ name: 'login' });
        }
      }, 1000);
      setTimeout(() => {
        (this.error = ``), (this.status = ``);
      }, 3000);
    },
  },
  mounted() {},
};
</script>

<template>
  <div class="wrapper">
    <div class="form-box">
      <form ref="form" @submit.prevent="submit">
        <h2 class="title">Регистрация</h2>
        <div class="input-box">
          <input v-model="username" type="text" required id="name" />
          <label for="name" class="name">Имя</label>
        </div>
        <div class="input-box">
          <input v-model="surname" type="text" required id="surname" />
          <label for="surname" class="surname">Фамилия</label>
        </div>
        <div class="input-box">
          <input v-model="email" type="email" required id="email" />
          <label for="email" class="email">Почта</label>
        </div>
        <div class="input-box">
          <input
            v-model="number"
            type="tel"
            size="20"
            maxlength="12"
            required
            id="number"
          />
          <label for="number" class="number">Номер телефона</label>
        </div>
        <div class="input-box">
          <input v-model="password" type="password" required id="password" />
          <label for="password" class="password"
            >Пароль (не менее 8 символов)</label
          >
        </div>
        <div class="group mb-3">
          <RouterLink to="/login" class="node">Перейти к входу</RouterLink>
        </div>
        <div class="sign-up">
          <button type="submit" class="sign-up-btn disabled" id="sign-up">
            Зарегистрироваться
          </button>
        </div>
        <div
          v-if="error"
          :class="{ error: status == '400', success: status == '200' }"
        >
          <span>{{ error }}</span>
        </div>
        <div class="email_check"></div>
      </form>
    </div>
  </div>
</template>

<style scoped>
* {
  font-weight: 550;
}
.success {
  position: absolute;
  bottom: -100px;
  width: 300px;
  text-align: center;
  padding: 10px;
  color: #a0dd75;
}
.error {
  position: absolute;
  bottom: -100px;
  width: 300px;
  text-align: center;
  padding: 10px;
  color: #dd7575;
}
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.form-box {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #d5d5d5;
  border: 1px solid #d5d5d5;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0px 0 10px 0 #ffffff71;
  flex-basis: 300px;
}

form {
  width: 100%;
}

a {
  color: #d5d5d5 !important;
  text-decoration: none;
}
.input-box {
  position: relative;
  margin: 25px 0;
  width: 100%;
  border-bottom: 2px solid #b3b3b3bc;
}

.input-box input {
  position: relative;
  width: 100%;
  height: 50px;
  background: transparent;
  border: none;
  border-radius: 10px;
  outline: none;
  font-size: 16px;
  padding: 0 35px 0 5px;
  /* color: #fff; */
}

input:focus ~ label,
input:valid ~ label {
  top: -12px;
}

.input-box label {
  /* color: #fff; */
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  font-size: 16px;
  pointer-events: none;
  transition: 0.3s;
}

.title {
  text-align: center;
}

.sign-up {
  display: flex;
  justify-content: center;
  align-items: center;
}

.node {
  color: black;
}

.sign-up-btn {
  background-color: transparent;
  border: 1px solid #d5d5d5;
  color: #d5d5d5;
  backdrop-filter: blur(6px);
  border-radius: 10px;
  padding: 5px 7px;
}
</style>
