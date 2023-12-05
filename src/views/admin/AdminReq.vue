<script>
import { RouterLink, RouterView } from 'vue-router';
import axios from 'axios';
import  dayjs from 'dayjs';
import 'dayjs/locale/ru';

export default {
  components: {
  },
  data() {
    return {
      requests: [],
      message: '',
      success: '',
      status: '',
      nameModel: '',
      category: ''
    };
  },
  methods: {
    getDate(data) {
      let date = new Date(data);
      let day = dayjs(date)
      dayjs.locale('ru')
      return day.format(`dd, D MMM`);
    },
    async accept(id, nameModel, event) {
      event.stopPropagation();
      let response = await axios.post(`/accept_request`, {
        id: id,
        nameModel: nameModel
      })
      this.success = response.data.success
      this.status = response.data.status
      this.message = response.data.message
      if (this.success) {
        this.request()
      }
      setTimeout(() => {
        this.success = false;
        this.message = '';
        this.status = ''
      }, 2000);
    }, 
    async reject(id, nameModel, event) {
      event.stopPropagation()
      let response = await axios.post(`/reject_request`, {
        id: id,
        nameModel: nameModel
      })
      this.success = response.data.success
      this.status = response.data.status
      this.message = response.data.message
      if (this.success) {
        this.request()
      }
      setTimeout(() => {
        this.success = false;
        this.message = '';
        this.status = ''
      }, 2000);
    },
    async request() {
      this.nameModel = this.$route.query.nameModel
      this.category = this.$route.query.category
      let response = await axios.post(`/admin_requests`, {
        nameModel: this.nameModel,
        category: this.category
      })
      this.requests = response.data.requests
    },
    open(id) {
      this.$router.push({
        path: '/card',
        query: { id: id, name: this.$route.query.category, view: true },
      });
    },
  },
  mounted() {
    this.request()
  }
};
</script>

<template>
    <div class="wrapper">

        <div class="wrapper-for-item" @click="$router.push({ path: `/transfer/card`, query: { id: item.id, view: true } })"
         v-if="nameModel == 'transfer'" v-for="item in requests">
          <div class="title">{{item.name}}</div>
          <div class="date">{{getDate(item.createdAt)}}</div>
          <div class="buttons">
            <button type="button" class="btn btn-danger" @click="reject(item.id, nameModel, $event)">Отклонить</button>
            <button type="button" class="btn btn-success" @click="accept(item.id, nameModel, $event)">Принять</button>
          </div>
        </div>

        <div class="wrapper-for-item" @click="$router.push({ path: `/taxi-delivery/card`, query: { id: item.id, view: true } })"
         v-else-if="nameModel == 'service'" v-for="item in requests">
          <div class="title">{{item.name}}</div>
          <div class="date">{{getDate(item.createdAt)}}</div>
          <div class="buttons">
            <button type="button" class="btn btn-danger" @click="reject(item.id, nameModel, $event)">Отклонить</button>
            <button type="button" class="btn btn-success" @click="accept(item.id, nameModel, $event)">Принять</button>
          </div>
        </div>

        <div class="wrapper-for-item 3" @click="open(item.id)" v-else v-for="item in requests">
          <div class="title">{{item.title}}</div>
          <div class="date">{{getDate(item.createdAt)}}</div>
          <div class="buttons">
            <button type="button" class="btn btn-danger" @click="reject(item.id, nameModel, $event)">Отклонить</button>
            <button type="button" class="btn btn-success" @click="accept(item.id, nameModel, $event)">Принять</button>
          </div>
        </div>
      </div>
      <div
        class="create-news"
        :class="{ success: status == 200, error: !status }"
        v-if="success"
      >
        {{ message }}
      </div>
</template>

<style scoped>
a{
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
  width: 90%;
  min-height: 590px;
  height: 590px;
  flex-basis: 100%;
  overflow-y: scroll;
}

.btn {
  z-index: 10;
}

.wrapper-for-item {
  width: 100%;
  border: 1px solid #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 0px 0 10px 0 #ffffff71;
  margin-bottom: 10px;

  transition: border 400ms;
}

.wrapper-for-item:hover {
  border: 1px solid black;
}

.title, .date {
  color: #fff;
}

.iconpng {
  width: auto;
  height: 10px; 
}

.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

</style>
