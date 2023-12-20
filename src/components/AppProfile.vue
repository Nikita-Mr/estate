<script>
import { RouterLink, RouterView } from "vue-router";
import axios from "axios";
import AppNav from '../components/AppNav.vue'

export default {
  components: {
    AppNav
  },

  data() {
    return {
      token: "",
      id: "",
      user: "",
    };
  },
  methods: {
    async load() {
      this.id = this.getCookieValue("id");
      if (this.id) {
        this.token = this.getCookieValue("token");
        let response = await axios.post(`/profile`, {
          id: this.id,
        });
        this.user = response.data.user;
      } else {
        this.$router.push({ name: 'login' })
      }
    },

    getCookieValue(name) {
      const cookies = document.cookie.split("; ");
      let res;
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        if (cookie.slice(0, 2) == name) {
          res = cookie.replace(name + "=", "");
        }
      }
      return res;
    },

    exit() {
      document.cookie = `token=${this.token}; max-age=0`;
      document.cookie = `id=${this.id}; max-age=0`;
      setTimeout(() => {
        location.reload()
      }, 1000);
    },
  },
  mounted() {
    this.load();
  },
};
</script>

<template>
  <div class="wrapper-profile">
    <div class="title">
      <span>Профиль</span>
    </div>
    <div class="wrapper-group">
      <div class="group">
        <span>Имя Фамилия: </span>
        <span>{{ user.username + " " + user.surname }}</span>
      </div>
      <div class="group">
        <span>Номер: </span>
        <span>{{ user.phone }}</span>
      </div>
      <div class="group">
        <span>Email: </span>
        <span>{{ user.email }}</span>
      </div>
    </div>
    <div class="exit">
      <button type="button" class="btn_exit" @click="exit">
        Выйти
      </button>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter&family=Poppins:wght@400;500&display=swap");
*,
*:before,
*:after {
  padding: 0;
  margin: 0;
  font-family: "Poppins", sans-serif;
}
* {
  color: #fff;
  font-size: 1.1rem;
}

span {
  transition: color 300ms;
}

span:hover {
  color: black;
}

input {
  border: none;
}
.submit {
  color: #46a71d;
  border: none;
  background: transparent;
}
.edit {
  border: none;
  background: transparent;
  color: #950707;
}

.group-input {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
}

input {
  color: black;
  background-color: #eeebd3;
  padding: 3px 5px;
  border-radius: 7px;
}
.group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.group span {
  right: 0;
}

.wrapper-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 50%;
  padding: 10px;
}
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: 100%;
  border-bottom: 1px solid #fff;
}

.title span {
  font-size: 2rem !important;
}

.wrapper-profile {
  height: 60vh;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 40px;
  gap: 50px;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.btn_exit {
  color: #FF1212;
  border: 1px solid #FF1212;
  background-color: transparent;
  padding: 5px 8px;
  border-radius: 15px;

  transition: all 500ms;
}

.btn_exit:hover, .btn_exit:active, .btn_exit:focus {
  transform: scale(1.07);
}

@media (max-width: 460px) {
  .title span {
    font-size: 1.6rem !important;
  }

  .group span {
    font-size: 1rem;
  }

  .group {
    flex-direction: column;
  }
}
</style>
