<script>
import { RouterLink, RouterView } from 'vue-router';
import axios from 'axios';

export default {
  data() {
    return {
      show: false,
      message: '',
      title: '',
      content: ''
    }
  },
  methods: {
    async createNews() {
      let response = await axios.post(`/create_news`, {
        title: this.title,
        content: this.content
      })
      this.show = response.data.show
      this.message = response.data.message

      setTimeout(() => {
        this.show = false;
        this.message = ''
      }, 3000);
    },
    showMessage(message) {
      this.message = message;
      this.show = true;
    },

  }
};

</script>

<template>
  <div class="wrapperNews mt-1 mb-1">
    <input v-model="title" type="text" name="title" class="titleInput" id="" placeholder="заголовок">

    <textarea v-model="content" name="content" id="" class="contentTextarea" placeholder="контент" cols="50"
      rows="10"></textarea>
      <div class="create-news" v-if="show">{{ message }}</div>
    <button v-else class="create-news" @click="createNews">Создать</button>
  </div>
</template>

<style scoped>


.titleInput {
  padding: 5px 7px;
  background-color: transparent;
  border: 1px solid #d5d5d5;
  box-shadow: 0px 0 10px 0 #ffffff71;
  border-radius: 15px;
  width: 30%;
}

.titleInput::placeholder {
  text-align: center;
  font-weight: 500;
  color: black;

  opacity: 0.6;
}

.contentTextarea {
  padding: 10px 15px;
  background-color: transparent;
  border: 1px solid #d5d5d5;
  box-shadow: 0px 0 10px 0 #ffffff71;
  border-radius: 15px;
  width: 60%;

}

.contentTextarea::placeholder {
  font-size: large;
  text-align: center;
  font-weight: 500;
  color: black;
  opacity: 0.6;
}

.create-news {
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #62A87C;
  border-radius: 10px;
  color: #62A87C;
  font-weight: 600;

  transition: scale 500ms;
}

.create-news:hover {
  scale: 1.06;
}

textarea {
  width: 90%;
  resize: none;
  height: 500px;
}

.wrapperNews {
  width: 100%;
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>