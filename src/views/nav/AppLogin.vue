<script>
import { RouterLink, RouterView } from 'vue-router';
import axios from 'axios';
export default {
  components: {},
  data() {
    return {
      email: ``,
      password: ``,
      token: ``,
      error: ``,
      status: Number,
    };
  },
  methods: {
    async submit() {
      let error = await axios.post(`/login`, {
        email: this.email,
        password: this.password,
      });
      this.error = error.data.message;
      this.status = error.data.status;
      this.token = error.data.token;
      if (this.token) {
        document.cookie = new String();
        document.cookie = `token=${this.token}; max-age=1123200`;
      }
      setTimeout(() => {
        if (this.status == 200) {
          this.$refs.form.reset();
          this.$router.push({ name: 'home' });
        }
      }, 1000);
      setTimeout(() => {
        (this.error = ``), (this.status = ``);
        if (error) {
          (this.email = ``), (this.password = ``);
        }
      }, 3000);
    },
    exit(){
      console.log(document.cookie)
    }
  },
  mounted() {
    this.exit()
  },
};
</script>

<template>
  <div class="wrapper-login">
    <div class="form-box">
      <form ref="form" @submit.prevent="submit">
        <h2 class="title">Вход</h2>
        <div class="input-box">
          <input
            v-model="email"
            name="email"
            type="email"
            class="email"
            required
          />
          <label for="">Почта</label>
        </div>
        <div class="input-box">
          <input
            v-model="password"
            name="password"
            type="password"
            class="password"
            required
          />
          <label for="">Пароль</label>
        </div>
        <div class="group mb-3">
          <RouterLink to="/register" class="node"
            >Перейти к регистрации</RouterLink
          >
        </div>
        <div class="sign-up">
          <button type="submit" class="sign-in">Войти</button>
        </div>
        <div
          v-if="error"
          :class="{ 'error': status == 400, 'success': status == 200 }"
        >
          <span>{{ error }}</span>
        </div>
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
.wrapper-login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
a {
  color: #d5d5d5 !important;
  text-decoration: none;
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

.sign-up button {
  background-color: transparent;
  border: 1px solid #d5d5d5;
  color: #d5d5d5;
  backdrop-filter: blur(6px);
  border-radius: 10px;
  padding: 5px 7px;
}
</style>
