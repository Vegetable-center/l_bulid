import { defineComponent } from "vue";
import '../declare/declare';
import '../style/editorRight.scss' 
import { containerData,userData } from "../stores";
import BlockOperate from "./blockOperate";

export default defineComponent({
    setup(){
        // const {containerBlocks}=containerData()
        // const {focus}=userData()
        return ()=> (
            <div>
                <div class="rightTitle">右侧控制台</div>
                <BlockOperate></BlockOperate>
            </div>
        );
    } 
})