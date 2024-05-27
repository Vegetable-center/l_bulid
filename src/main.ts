import { createApp } from 'vue'
import App from './App.vue'
import './icon/icon.css'
import { createPinia } from "pinia";
import 'element-plus/dist/index.css'

const pinia=createPinia()

createApp(App).use(pinia).mount('#app')
