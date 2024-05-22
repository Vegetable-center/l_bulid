import { defineComponent } from "vue";
import { containerData} from "../stores";
import { registerConfig as config } from "./blocksConfig";

export default defineComponent({
    components:{
        ElButton,
    },
    setup(){
        const useContainer=containerData();
        const {containerBlocks}=useContainer;
        console.log(containerBlocks);
        return ()=>(
            <>
            {
                containerBlocks.map(block => {
                    const component=config.componentMap[(block as {key:string}).key];
                    const renderComponet=component.render();
                    const classMo=[''];
                    if(!(block as {display:boolean}).display){
                        classMo.push('inline');
                    }
                    return <div class={classMo.join(' ')}>
                        {renderComponet}
                    </div>
                })
            }
            </>
        )
    }
})