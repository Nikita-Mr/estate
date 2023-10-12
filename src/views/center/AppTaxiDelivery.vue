<script>
import axios from 'axios';
import { RouterLink, RouterView } from 'vue-router'
import AppService from '/src/components/AppService.vue'

export default {
  components: {
    AppService
  },
  data() {
    return {
      INFO: []
    }
  },
  methods: {
    async ServiceLoad() {
      let service = await axios.get(`/services`, { // не работает error
          headers: {
            Authorization: document.cookie.replace('token=', ``),
          },
        });
        this.INFO = service.data.services;
    }
  },
  mounted() {
    this.ServiceLoad()
  }
}
</script>

<template>
    <div class="wrapper-for-content">
      <div class="hotel-wrapper">
    <div class="row row-cols-lg-4 row-cols-md-3 row-cols-sm-2">
      <div v-for="(cardInfo, index) in INFO" class="cols">
        <AppService :name="cardInfo.name" :phone="cardInfo.phone" :description="cardInfo.description" :i="index"/>
      </div>
    </div>
  </div>
      <div class="create-service">
        <RouterLink to="/create-service">Опубликовать услугу</RouterLink>
      </div>
    </div>
</template>

<style scoped>

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

</style>
