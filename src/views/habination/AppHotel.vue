<script>
import { RouterLink, RouterView } from 'vue-router';
import AppCard from '/src/components/AppCard.vue';
import axios from 'axios';

export default {
  components: {
    AppCard,
  },
  data() {
    return {
      INFO: [],
      admin: '',
      expired: false
    };
  },
  mounted() {
    this.loadInfo();
  },
  methods: {
    async loadInfo() {
      if (this.$route.path == `/habitation/items`) {
        let hotel = await axios.get(`/habitationDebug`, { // не работает error
          headers: {
            Authorization: document.cookie.replace('token=', ``),
          },
        });
        this.INFO = hotel.data.response;
        this.admin = hotel.data.admin;
        this.expired = hotel.data.expired;
        if (this.expired) {
          this.$router.push({ path: `/login` });
        }
      }
      if (this.$route.path == `/event/items`) {
        let events = await axios.get(`/event/items`, {
          params: { name: this.$route.query.name },
          headers: {
            Authorization: document.cookie.replace('token=', ``),
          },
        });
        this.INFO = events.data.cards;
        this.admin = events.data.admin;
        this.expired = events.data.expired;
      }
      if (this.$route.path == `/rental/items`) {
        let rental = await axios.get(`/rental/items`, {
          params: { name: this.$route.query.name },
          headers: {
            Authorization: document.cookie.replace('token=', ``),
          },
        });
        this.INFO = rental.data.cards;
        this.admin = rental.data.admin;
        this.expired = rental.data.expired;
      }
      if (this.$route.path == `/forChildren/items`) {
        let forChildren = await axios.get(`/forChildren/items`, {
          params: { name: this.$route.query.name },
          headers: {
            Authorization: document.cookie.replace('token=', ``),
          },
        });
        this.INFO = forChildren.data.cards;
        this.admin = forChildren.data.admin;
        this.expired = forChildren.data.expired;
      }
      if (this.$route.path == `/instructor-tours/items`) {
        let InstructorTours = await axios.get(`/instructor-tours/items`, {
          params: { name: this.$route.query.name },
          headers: {
            Authorization: document.cookie.replace('token=', ``),
          },
        });
        this.INFO = InstructorTours.data.cards;
        this.admin = InstructorTours.data.admin;
        this.expired = InstructorTours.data.expired;
      }
    },
    open(id) {
      this.$router.push({
        path: '/card',
        query: { id: id, name: this.$route.path.slice(1, -6) },
      });
    },
  },
};
</script>

<template>
  <div class="hotel-wrapper">
    <div class="row row-cols-lg-4 row-cols-md-3 row-cols-sm-2">
      <div v-if="admin" class="cols create-card">
        <RouterLink :to="`/create-card?name=`+ $route.query.name">
          <div class="cross">
            <div class="line"></div>
            <div class="line"></div>
          </div>
        </RouterLink>
      </div>
      <div v-for="(cardInfo, index) in INFO" class="cols">
        <AppCard
          :i="index"
          :title="cardInfo.title"
          :img="cardInfo.img"
          :price="cardInfo.price"
          :p="cardInfo.p"
          :id="cardInfo._id"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cross {
  border: 4px dotted var(--mainColor);
  min-height: 290px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.cross:hover {
  box-shadow: 0 0 10px 0 var(--mainColor);
  transform: scale(105%);
}
.line {
  transform: rotate(0deg) !important;
  width: 20% !important;
}
.line:last-child {
  transform: rotate(90deg) !important;
  display: block;
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
