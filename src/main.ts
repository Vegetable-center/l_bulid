import { createApp } from 'vue'
import App from './App.vue'
import './icon/icon.css'
import { createPinia } from "pinia";
import 'element-plus/dist/index.css'
import router from './router';

const pinia=createPinia()

createApp(App).use(pinia).use(router).mount('#app')
