import {createRouter,createWebHistory} from 'vue-router';
import editorAll from '../view/editorAll.vue';
import previewPage from '../view/previewPage.vue';

const routes = [
    {path:'/',redirect:'/editor'},
    {path:'/editor',component:editorAll},
    {path:'/preview',component:previewPage}
]
const router = createRouter({
    history:createWebHistory(),
    routes
})
export default router