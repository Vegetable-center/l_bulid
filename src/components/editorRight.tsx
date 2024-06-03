import { defineComponent, ref } from "vue";
import '../declare/declare';
import '../style/editorRight.scss' 
import BlockOperate from "./blockOperate";
import StyleOperate from "./styleOperate";
import { ElColorPicker, ElInputNumber, ElTabPane, ElTabs, TabsPaneContext } from "element-plus";

export default defineComponent({
    setup(){
        const activeName=ref('first');

        return ()=> (
            <div>
                {/* <div class="rightTitle">右侧控制台</div> */}
                <ElTabs v-model={activeName.value} class="demo-tabs">
                  <ElTabPane label="Props" name="first">
                    <BlockOperate></BlockOperate>
                  </ElTabPane>
                  <ElTabPane label="Styles" name="second">
                    <StyleOperate></StyleOperate>
                  </ElTabPane>
                </ElTabs>
            </div>
        );
    } 
})