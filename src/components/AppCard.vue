<script>
import { RouterLink, RouterView } from 'vue-router';

import axios from 'axios';

export default {
  props: {
    img: String,
    title: String,
    p: String,
    price: Number,
    i: Number,
    id: Number,
    children: Number,
    adults: Number,
    target: Number
  },
  components: {},
  data() {},
  methods: {
    open() {
      this.$router.push({
        path: '/card',
        query: { id: this.id, name: this.$route.path.slice(1, -6) },
      });
    },
    sendVariable() {
      this.$emit('variable', {target: 1, numberid: this.i});
    }
  },
  mounted() {},
};
</script>

<template>
  <div class="card">
    <img
      v-if="img"
      class="card-img-top"
      @click="open"
      :src="'/dist/assets/img/user/' + Array.from(img)[0]"
      alt=""
    />
    <div class="card-body">
      <h5 class="card-title">
        <span class="title">{{ title }}</span>
        <span class="price" v-if="price">{{ price }} руб</span>
      </h5>
      <div class="accordion" id="accordionExample">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingThree">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="`#collapse` + i"
              aria-expanded="false"
              :aria-controls="`collapse` + i"
            >
              Подробнее
            </button>
          </h2>
          <div
            :id="`collapse` + i"
            class="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <p v-if="children" class="card-text">
                Мест для детей: {{ children }}
              </p>
              <p v-if="adults" class="card-text">
                Мест для взрослых: {{ adults }}
              </p>
              <p class="card-text">{{ p }}</p>
              <button @click="sendVariable" v-if="children">Забронировать</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.accordion-body button {
  display: block;
  margin: 0 auto;
  border: none;
  width: 100%;
  padding: 5px 0;
  box-shadow: 0 0 10px 0 #00000037;
}
img {
  width: auto;
  max-height: 180px;
  min-height: 180px;
  object-fit: cover;
  border-radius: 5px 5px 0 0;
}
.price {
  font-size: 13px;
}
h5 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card {
  color: var(--mainColor);
  background-color: transparent;
  border: 1px solid var(--mainColor);
  cursor: pointer;
  min-height: 290px;
}
.card:hover {
  box-shadow: 0 0 10px 0 var(--mainColor);
  transform: scale(105%);
}
</style>
