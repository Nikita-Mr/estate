<script>
import { RouterLink, RouterView } from "vue-router";
import AppCard from "/src/components/AppCard.vue";
import axios from "axios";

export default {
  components: {
    AppCard,
  },
  data() {
    return {
      INFO: [],
      admin: "",
      expired: false,
    };
  },
  mounted() {
    this.loadInfo();
  },
  methods: {
    async loadInfo() {
      if (this.$route.path == `/habitation/items`) {
        let response = await axios.post(`/habitation`, {
          id: this.getCookieValue("id"),
          category: this.$route.path.slice(1, -6),
          name: this.$route.query.name,
        });
        this.INFO = response.data.cards.reverse();
        this.admin = response.data.admin;
        this.expired = response.data.expired;
        if (this.expired) {
          this.$router.push({ path: `/login` });
        }
      }
      if (this.$route.path == `/event/items`) {
        let events = await axios.post(`/event`, {
          id: this.getCookieValue("id"),
          category: this.$route.path.slice(1, -6),
          name: this.$route.query.name,
        });
        this.INFO = events.data.cards.reverse();
        this.admin = events.data.admin;
        this.expired = events.data.expired;
      }
      if (this.$route.path == `/rental/items`) {
        let rental = await axios.post(`/rental`, {
          id: this.getCookieValue("id"),
          category: this.$route.path.slice(1, -6),
          name: this.$route.query.name,
        });
        this.INFO = rental.data.cards.reverse();
        this.admin = rental.data.admin;
        this.expired = rental.data.expired;
      }
      if (this.$route.path == `/forChildren/items`) {
        let forChildren = await axios.post(`/forChildren`, {
          id: this.getCookieValue("id"),
          category: this.$route.path.slice(1, -6),
          name: this.$route.query.name,
        });
        this.INFO = forChildren.data.cards.reverse();
        this.admin = forChildren.data.admin;
        this.expired = forChildren.data.expired;
      }
      if (this.$route.path == `/instructor-tours/items`) {
        let InstructorTours = await axios.post(`/instructor-tours`, {
          id: this.getCookieValue("id"),
          category: this.$route.path.slice(1, -6),
          name: this.$route.query.name,
        });
        this.INFO = InstructorTours.data.cards.reverse();
        this.admin = InstructorTours.data.admin;
        this.expired = InstructorTours.data.expired;
      }
      if (this.$route.path == `/ads/items`) {
        let ads = await axios.post(`/ads`, {
          id: this.getCookieValue('id'),
          category: this.$route.path.slice(1, -6),
          name: this.$route.query.name
        });
        this.INFO = ads.data.cards.reverse();
        this.admin = ads.data.admin;
        this.expired = ads.data.expired;
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

    open(id) {
      this.$router.push({
        path: "/card",
        query: { id: id, name: this.$route.path.slice(1, -6) },
      });
    },
    category(name) {
      return name.slice(0, -5);
    },
  },
};
</script>

<template>
  <div class="hotel-wrapper">
    <div class="row row-cols-lg-4 row-cols-md-3 row-cols-sm-2">
      <div v-if="admin" class="cols create-card">
        <RouterLink
          :to="
            `/create-card?name=` +
            $route.query.name +
            `&category=${category($route.name)}`
          "
        >
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
          :id="cardInfo.id"
        />
      </div>
    </div>
    <div v-if="INFO.length == 0 || !INFO" class="empty"><img src="../../assets/img/empty.png" alt=""><span>Пусто...</span></div>
  </div>
</template>

<style scoped>
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
.cross {
  border: 4px dotted var(--mainColor);
  min-height: 290px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
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
.cross .line:last-child {
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
