import { defineComponent } from "vue";
import '../declare/declare';
import '../style/editorTop.scss' 

export default defineComponent({
    setup(){
        return ()=> (
            <div class="topContent">
                <div class="logo"></div>
                <div class="topTitle">顶部操作台</div>
            </div>
        );
    } 
})