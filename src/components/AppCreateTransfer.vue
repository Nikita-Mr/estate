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
        <input v-model="title" type="text" name="name" class="form-input name" id="" placeholder="имя">
        <input v-model="title" type="text" name="cityfrom" class="form-input cityfrom" id="" placeholder="откуда">
        <input v-model="title" type="text" name="cityto" class="form-input cityto" id="" placeholder="куда">
        <input v-model="title" type="text" name="timefrom" class="form-input timefrom" id="" placeholder="время отъезда">
        <input v-model="title" type="text" name="timeto" class="form-input timeto" id="" placeholder="время прибытия">
        <input v-model="title" type="text" name="car" class="form-input car" id="" placeholder="модель машины">
        <select class="form-select form-input" aria-label="Default select example">
            <option name="typeCar" disabled selected>Тип машины</option>
            <option value="bus">Автобус</option>
            <option value="car">Легковая</option>
        </select>
        <input v-model="title" type="number" name="passenger" class="form-input passenger" id=""
            placeholder="количество пассажиров в машине">
        <input v-model="title" type="number" name="price" class="form-input price" id="" placeholder="цена">

        <div class="create-news" v-if="show">{{ message }}</div>
        <button v-else class="create-news" @click="createNews">Создать</button>
    </div>
</template>

<style scoped>
.form-input {
    padding: 5px 7px;
    background-color: transparent;
    border: 1px solid #d5d5d5;
    box-shadow: 0px 0 10px 0 #ffffff71;
    border-radius: 15px;
    width: 30%;
}

.form-input::placeholder {
    text-align: center;
    font-weight: 500;
    color: black;
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