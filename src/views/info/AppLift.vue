<script>
import { RouterLink, RouterView } from "vue-router";
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      LIFTS: ``,
      admin: false,
    };
  },
  methods: {
    async loadLift() {
      await axios
        .post(`/lifts`, {
          headers: {
            Authorization: document.cookie.replace("token=", ``),
          },
        })
        .then((e) => {
          this.LIFTS = e.data.lifts;
        });
    },

    async delete_lift(id) {
      await axios.post(`/delete_lift`, {
        id: id,
      });
      this.loadLift();
    },

    async check_admin() {
      let response = await axios.get(`/check_admin`, {
        headers: {
          Authorization: document.cookie.replace("token=", ``),
        },
      });
      console.log(response)
      this.admin = response.data.admin;
    },
  },
  mounted() {
    this.check_admin();
    this.loadLift();
  },
};
</script>

<template>
  <div class="wrapperLifts">
    <div v-if="admin" class="create-news">
      <RouterLink to="/lift/create-lift">Опубликовать информацию</RouterLink>
    </div>
    <div class="content">
      <div class="wrapper" v-for="item in LIFTS">
        <div class="box">
          <div class="title">{{ item.title }}</div>
          <div class="price">{{ item.price }} ₽/разовый подъём</div>
        </div>
        <div class="box">
          <div class="text">Местоположение:</div>
          <div class="geo">{{ item.geo }}</div>
        </div>
        <div class="box">
          <div class="text">Время работы</div>
          <div class="working_hours">
            с {{ item.working_hours_start }} до {{ item.working_hours_finish }}
          </div>
        </div>
        <div class="box">
          <div class="text">Время подъёма:</div>
          <div class="lifting_time">{{ item.lifting_time }}</div>
        </div>
        <div class="box">
          <div class="text">Номер телефона:</div>
          <div class="phone">{{ item.phone }}</div>
        </div>
        <div class="delete_lift" v-if="admin">
          <button type="button" @click="delete_lift(item.id)" class="btn btn-outline-danger">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-news {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: sticky;
  margin-top: 10px;
  margin-bottom: 10px;
}

.divDelete {
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  margin-right: 10px;
  z-index: 10;
}

.delete {
  width: fit-content;
  position: absolute;
  background: transparent;
  color: #ee2e31;
  border: 1px solid #ee2e31;
  border-radius: 10px;
  padding: 5px 10px;
  z-index: 1000000;
}

.delete_lift {
  position: absolute;
  bottom: 5%;
  right: 3%;
}

a {
  width: fit-content;
  padding: 5px 10px;
  border-radius: 10px;
  /* position: absolute; */
  /* top: 10px;
  right: 10px; */
  background: transparent;
  border: 1px solid var(--mainColor);
  color: var(--mainColor);

  transition: scale 500ms;
}

a:hover {
  scale: 1.05;
}

.wrapperLifts {
  margin-top: 10px;
  width: 90%;
  max-height: 600px;
  min-height: 600px;
  overflow-y: scroll;
}

.wrapperLifts::-webkit-scrollbar {
  width: 0;
}

.content {
  width: 100%;
  padding: 7px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.wrapper {
  position: relative;
  padding: 20px;
  flex: 40%;
  border: 1px solid #fff;
  border-radius: 15px;
  box-shadow: 0px 0 10px 0 #ffffff71;

  transition: border 400ms;
}

.box {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.box div {
  width: 50%;
  color: var(--mainColor);
  font-weight: 600;
  
  transition: color 400ms;
}

.box div:hover {
  color: black;
}

.title {
  font-size: 1.5rem;
}

.price {
  font-size: 1.2rem;
}

.wrapper:hover {
  border: 1px solid black;
}
</style>
