<script>
import { RouterLink, RouterView } from "vue-router";
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      skipass: ``,
      admin: false,
      id: ''
    };
  },
  methods: {
    async loadInfo() {
      let response = await axios.post(`/skipass`);
      this.skipass = response.data.skipass
    },

    async check_admin() {
      this.id = this.getCookieValue('id')
			let response = await axios.post(`/check_admin`, {
        id: this.id
      });
			this.admin = response.data.admin
    },

    async delete_skipass(id) {
      await axios.post(`/delete_skipass`, {
        id: id,
      });
      this.loadInfo();
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
		this.check_admin()
    this.loadInfo();
  },
};
</script>

<template>
  <div class="wrapperNews">
    <div v-if="admin" class="create-news">
      <RouterLink to="/skipass/create">Создать ски-пасс</RouterLink>
    </div>
    <div class="accordion" id="accordionExample">
      <div class="accordion-item" v-for="(item, i) in skipass">
        <h2 class="accordion-header" :id="'heading' + i">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="'#collapse' + i"
            aria-expanded="true"
            :aria-controls="'collapse' + i"
          >
            {{ item.title }}
            <div class="divDelete">
              <button v-if="admin" class="delete" @click="delete_skipass(item.id)">
                Удалить
              </button>
            </div>
          </button>
        </h2>
        <div
          :id="'collapse' + i"
          class="accordion-collapse collapse"
          :aria-labelledby="'heading' + i"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            {{ item.content }}
          </div>
        </div>
      </div>
      <div v-if="skipass.length == 0 || !skipass" class="empty"><img src="../../assets/img/empty.png" alt=""><span>Пусто...</span></div>
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

.wrapperNews {
  margin-top: 10px;
  width: 100%;
  max-height: 600px;
  min-height: 600px;
  overflow-y: scroll;
}

.accordion-body {
  color: var(--mainColor);
}

.wrapperNews::-webkit-scrollbar {
  width: 0;
}

.accordion-item {
  background: transparent;
  border: 1px solid var(--mainColor);
}

.accordion-button {
  border: none;
  padding: 10px !important;
  background: transparent;
  color: var(--mainColor);
  z-index: 9;
}

.accordion-button:focus {
  box-shadow: none;
  border: none;
}

.accordion-button::after {
  background-image: url("/src/assets/img/arrow-down-sign-to-navigate.png");
  transform: rotate(0);
}

.accordion-button:not(.collapsed)::after {
  background-image: url("/src/assets/img/arrow-down-sign-to-navigate.png");
  transform: rotate(-180deg);
}

@media screen and (width <=600px) {
  .delete {
    width: fit-content;
    position: absolute;
    background: transparent;
    color: #ee2e31;
    border: 1px solid #ee2e31;
    border-radius: 10px;
    padding: 5px 10px;
    z-index: 1000000;
    font-size: small;
  }
}
</style>
