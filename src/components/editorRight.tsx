import { defineComponent } from "vue";
import '../declare/declare';
import '../style/editorRight.scss' 

export default defineComponent({
    setup(){
        return ()=> (
            <div>
                <div class="rightTitle">右侧控制台</div>
            </div>
        );
    } 
})