<script>
import axios from 'axios';
import { RouterLink, RouterView } from 'vue-router';
import AppService  from '/src/components/AppService.vue';

export default {
  components: {
    AppService,
  },
  data() {
    return {
      INFO: [],
      admin: false,
      id: ''
    };
  },
  methods: {
    async ServiceLoad() {
      let response = await axios.post(`/services`, {
        id: this.getCookieValue('id')
      });
      this.INFO = response.data.services;
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
  mounted() {
    this.ServiceLoad();
  },
};
</script>

<template>
  <div class="wrapper-for-content">
    <div class="hotel-wrapper">
      <div class="row row-cols-lg-4 row-cols-md-3 row-cols-sm-2">
        <div v-for="(cardInfo, index) in INFO" class="cols">
          <AppService
            v-if="cardInfo.verified"
            @click="$router.push({ path: `/taxi-delivery/card`, query: { id: cardInfo.id } })"
            :img="cardInfo.img"
            :name="cardInfo.name"
            :phone="cardInfo.phone"
            :description="cardInfo.description"
            :i="index"
          />
        </div>
      </div>
      <div v-if="INFO.length == 0 || !INFO" class="empty"><img src="../../assets/img/empty.png" alt=""><span>Пусто...</span></div>
    </div>
    <div class="create-service">
      <RouterLink v-if="admin" to="/create-service">Опубликовать услугу</RouterLink>
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
.create-service {
  position: absolute;
  bottom: 2%;
  width: 100%;
  display: flex;
  justify-content: center;
}

.wrapper-for-content {
  width: 100%;
}
.create-service {
  position: absolute;
  bottom: 2%;
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
.create-service a:hover{
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
</style>
