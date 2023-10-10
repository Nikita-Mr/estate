<script>
import { RouterLink, RouterView } from 'vue-router';
import axios from 'axios';
export default {
    data() {
        return {
            show: false,
            message: '',
            name: '',
            cityfrom: '',
            cityto: '',
            datefrom: new Date().toLocaleDateString('en-CA'),
            dateto: '',
            timefrom: '',
            timeto: '',
            typeCar: '',
            car: '',
            passenger: '',
            price: ''
        }
    },
    methods: {
        async createTransfer() {
            let response = await axios.post(`/create_transfer`, {
                name: this.name,
                cityfrom: this.cityfrom,
                cityto: this.cityto,
                datefrom: this.datefrom,
                dateto: this.dateto,
                timefrom: this.timefrom,
                timeto: this.timeto,
                typeCar: this.typeCar,
                car: this.car,
                passenger: this.passenger,
                price: this.price
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
    <div class="titlebody">Создание трансфера</div>
    <div class="wrapper-for-form">
        <div class="col1">
            <div class="input-group">
                <div class="title">Имя:</div>
                <div class="wrapper-for-input">
                    <input v-model="name" type="text" name="name" class="form-input name" id="">
                </div>
            </div>
            <div class="input-group">
                <div class="title">Откуда:</div>
                <div class="wrapper-for-input">
                    <input v-model="cityfrom" type="text" name="cityfrom" class="form-input cityfrom" id="">
                </div>
            </div>
            <div class="input-group">
                <div class="title">Куда:</div>
                <div class="wrapper-for-input">
                    <input v-model="cityto" type="text" name="cityto" class="form-input cityto" id="">
                </div>
            </div>
            <div class="input-group">
                <div class="title">Дата отъезда:</div>
                <div class="wrapper-for-input">
                    <input v-model="datefrom" type="date" name="datefrom" class="form-input datefrom" id="">
                </div>
            </div>
            <div class="input-group">
                <div class="title">Дата приезда:</div>
                <div class="wrapper-for-input">
                    <input v-model="dateto" type="date" name="dateto" class="form-input dateto" id="">
                </div>
            </div>
            <div class="input-group">
                <div class="title">Время отъезда:</div>
                <div class="wrapper-for-input">
                    <input v-model="timefrom" type="text" name="timefrom" class="form-input timefrom" id="">
                </div>
            </div>
        </div>
        <div class="col1">
            <div class="input-group">
                <div class="title">Время приезда:</div>
                <div class="wrapper-for-input">
                    <input v-model="timeto" type="text" name="timeto" class="form-input timeto" id="">
                </div>
            </div>
            <div class="input-group">
                <div class="title">Тип машины:</div>
                <div class="wrapper-for-input">
                    <select v-model="typeCar" name="typeCar" class="form-select form-input typeCar"
                        aria-label="Default select example">
                        <option value="car">Легковая</option>
                        <option value="bus">Автобус</option>
                    </select>
                </div>
            </div>
            <div class="input-group">
                <div class="title">Модель машины:</div>
                <div class="wrapper-for-input">
                    <input v-model="car" type="text" name="car" class="form-input car" id="">
                </div>
            </div>
            <div class="input-group">
                <div class="title titleMore">Количество пассажиров в машине:</div>
                <div class="wrapper-for-input">
                    <input v-model="passenger" type="number" name="passenger" class="form-input passenger" id="">
                </div>
            </div>
            <div class="input-group">
                <div class="title">Цена:</div>
                <div class="wrapper-for-input">
                    <input v-model="price" type="number" name="price" class="form-input price" id="">
                </div>
            </div>
        </div>
    </div>
    <div class="create-news" v-if="show">{{ message }}</div>
    <button v-else class="create-transfer" @click="createTransfer">Опубликовать</button>
</template>

<style scoped>
.titlebody {
    color: #d5d5d5;
    font-weight: 600;
    position: absolute;
    top: 0%;
    margin-top: 15px;
    font-size: large;
}

.wrapper-for-input {
    width: 50%;
}

.input-group {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.input-group .title:hover {
    color: black;
}

.title {
    color: #d5d5d5;
    font-weight: 600;
    text-align: end;
    width: 30%;

    transition: color 300ms;
}

.input-group .form-input {
    width: 100%;
}

.form-input {
    padding: 5px 7px;
    background-color: transparent;
    border: 1px solid #d5d5d5;
    box-shadow: 0px 0 10px 0 #ffffff71;

    transition: color 300ms;
}

.form-input::placeholder {
    text-align: center;
    font-weight: 500;
    color: #d5d5d5;
}

.form-input:focus,
.form-input:hover {
    color: #d5d5d5;
}

.create-transfer {
    position: absolute;
    bottom: 0;
    margin-bottom: 15px;
    padding: 5px 15px;
    background-color: transparent;
    border: 1px solid #62A87C;
    border-radius: 10px;
    color: #62A87C;
    font-weight: 600;

    transition: scale 500ms;
}

.create-transfer:hover {
    scale: 1.06;
}

.wrapper-for-form {
    width: 100%;
    gap: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* flex-direction: column; */
}

select {
    box-sizing: border-box;
}

.col1 {
    width: 45%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    flex-direction: column;
}

@media screen and (width <=1200px) {
    .col1 {
        gap: 5px
    }

    .title {
        font-size: small;
        width: 20%;
        text-align: end;
        line-height: 0.8;
    }

    .titleMore {
        font-size: 10px;
    }

    .wrapper-for-input {
        margin-left: 10px;
    }

    .input-group {
        gap: 30px;
    }

}

@media (max-width: 420px) {
    .container {
        display: flex;
    }
}
</style>