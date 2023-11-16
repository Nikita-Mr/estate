<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
    data(){
        return{
            trigger: 0
        }
    },
    methods: {
        click(){
            if(this.trigger == 1){
                this.trigger = 0
            } else{
                this.trigger = 1
            }
            
        }
    }
}
</script>

<template>
    <div :class="{'active': this.trigger == '1'}" class="wrapper-for-slider">
    <nav>
        <ul class="list-nav">
            <RouterLink to="/info" @click="trigger = 0"><li class="list-item-nav">ИНФО</li></RouterLink>
            <RouterLink to="/transfer-taksi" @click="trigger = 0"><li class="list-item-nav">Трансфер/Такси</li></RouterLink>
            <RouterLink to="/habitation" @click="trigger = 0"><li class="list-item-nav">Проживание</li></RouterLink>
            <RouterLink to="/rental" @click="trigger = 0"><li class="list-item-nav">Прокат</li></RouterLink>
            <RouterLink to="/events" @click="trigger = 0"><li class="list-item-nav">Развлечения</li></RouterLink>
            <RouterLink to="/forChildren" @click="trigger = 0"><li class="list-item-nav">Детям</li></RouterLink>
            <RouterLink to="/instructor-tours" @click="trigger = 0"><li class="list-item-nav">Инструктор/Туры</li></RouterLink>
            <RouterLink to="/news" @click="trigger = 0"><li class="list-item-nav">Новости</li></RouterLink>
            <RouterLink to="/ads" @click="trigger = 0"><li class="list-item-nav">Объявления</li></RouterLink>
        </ul>
    </nav>
    </div>
    <div class="wrap-line" @click="click"  >
        <div v-if="trigger" class="line line-2"></div>
        <div class="line line-1"></div>
        <div v-if="!trigger" class="line line-2"></div>
    </div>
</template>

<style scoped>
.wrapper-for-slider{
    width: fit-content;
    position: absolute;
    left: 30px;
    top: calc(50% - 300px);
    transform: translate(-400px);
    transition: transform 300ms;
    z-index: 3;
}
.active{
    transform: translate(0);
    transition: all 300ms;
}
.list-nav{
    display: block;
    width: fit-content;
}
.wrapper-for-slider nav{
   height: auto; 
}


.wrap-line{
    width: 20px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 5px;
    top: calc(50% - 35px);
    gap: 2px;
    height: auto;
    cursor: pointer;
    z-index: 3;
}

.wrap-line:active .wrapper-for-slider{
    transform: translate(0);
    transition: transform 300ms;
}
.line{
    width: 3px;
    height: 70px;
    background-color: #fff;
}
.line-2{
    height: 50px;
    
}

</style>
