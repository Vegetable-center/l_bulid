import { createApp } from 'vue'
import App from './App.vue'
import './icon/icon.css'
import { createPinia } from "pinia";

const pinia=createPinia()

createApp(App).use(pinia).mount('#app')
