<script>
import axios from "axios";
import { RouterLink, RouterView } from "vue-router";
import AppService from "/src/components/AppService.vue";

export default {
  components: {
    AppService,
  },
  data() {
    return {
      info: [],
      admin: false,
      id: "",
    };
  },
  methods: {
    async ServiceLoad() {
      let response = await axios.post(`/services`, {
        id: this.getCookieValue("id"),
      });
      this.info = response.data.services;
      this.admin = response.data.admin;
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
  },
  async mounted() {
    try {
      await this.ServiceLoad();
    } catch (error) {
      console.error(error);
    }
  },
};
</script>

<template>
  <div class="wrapper-for-content">
    <div class="create-service">
      <RouterLink v-if="admin" to="/create-service"
        >Опубликовать услугу</RouterLink
      >
    </div>
    <div class="hotel-wrapper">
      <div class="row row-cols-lg-4 row-cols-md-3 row-cols-sm-2">
        <div v-for="(cardInfo, index) in info" class="cols">
          <AppService
            v-if="cardInfo.verified"
            @click="
              $router.push({
                path: `/taxi-delivery/card`,
                query: { id: cardInfo.id },
              })
            "
            :img="cardInfo.img"
            :name="cardInfo.name"
            :phone="cardInfo.phone"
            :description="cardInfo.description"
            :i="index"
          />
        </div>
      </div>
      <div v-if="info.length == 0 || !info" class="empty">
        <img src="../../assets/img/empty.png" alt="" /><span>Пусто...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper-for-content {
  width: 100%;
}
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 1.7rem;
  color: #fff;
  height: 60vh;
}

.empty img {
  height: 70px;
}

.wrapper-for-content {
  width: 100%;
  position: relative;
}
.create-service {
  width: 100%;
  display: flex;
  justify-content: center;
}

.create-service a {
  width: fit-content;
  padding: 5px 10px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid var(--mainColor);
  color: var(--mainColor);

  transition: scale 500ms;
}
.create-service a:hover {
  scale: 1.06;
}

.row {
  width: 100%;
  height: auto;
}
.cols {
  padding: 10px;
}
.hotel-wrapper {
  padding: 15px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  height: 500px;
  overflow-y: scroll;
}
.hotel-wrapper::-webkit-scrollbar {
  width: 0;
}

.create-service a:hover {
  scale: 1.06;
}

.row {
  width: 100%;
  height: auto;
}
.cols {
  padding: 10px;
  width: 25%;
}
.hotel-wrapper {
  padding: 15px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  height: 65vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.hotel-wrapper::-webkit-scrollbar {
  width: 0;
}

@media (max-width: 1200px) {
  .cols {
    width: 33%;
  }
}

@media (max-width: 1000px) {
  .cols {
    width: 48%;
  }
}
</style>
