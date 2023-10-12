<script>
import { RouterLink, RouterView } from 'vue-router';

import axios from 'axios';

export default {
  props: {
    img: String,
    name: String,
    phone: String,
    description: String,
    i: Number
  },
  components: {},
  data() {},
  methods: {
  open(){
    this.$router.push({
        path: '/card',
        query: { id: this.id, name: this.$route.path.slice(1, -6) },
      });
  }
  },
  mounted() {},
};
</script>

<template>
  <div class="card">
    <img class="card-img-top" @click="open" :src="'/dist/assets/img/user/' + Array.from(img)[0]" alt="" />
    <div class="card-body">
      <h5 class="card-title">
        <span class="title">{{ name }}</span>
        <span class="price">{{ phone }}</span>
      </h5>
      <div class="accordion" id="accordionExample">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingThree">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="`#collapse`+i"
              aria-expanded="false"
              :aria-controls="`collapse`+i"
            >
              Подробнее
            </button>
          </h2>
          <div
            :id="`collapse`+i"
            class="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <p class="card-text">{{ description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
