import './assets/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'


import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3005';

const app = createApp(App)

app.use(router)

app.mount('#app')
