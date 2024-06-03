import { defineComponent } from "vue";
import { containerData} from "../stores";
import { registerConfig as config } from "./blocksConfig";

export default defineComponent({
    components:{
        ElButton,
    },
    props:{
        formData:{
            type:Object
        }
    },
    setup(props){
        const useContainer=containerData();
        const {containerBlocks}=useContainer;
        console.log(containerBlocks);
        return ()=>(
            <>
            {
                containerBlocks.map((block:block) => {
                    const component=config.componentMap[(block as {key:string}).key];
                    const renderComponet=component.render({
                        props:(block as {props:Object}).props,
                        model:Object.keys(block.model||{}).reduce((prev,modelName)=>{
                            console.log(modelName);
                            console.log("prev:"+JSON.stringify(prev));
                            
                            let propName=block.model[modelName]  //"username"
                            prev[modelName]={
                                modelValue:props.formData?.[propName],
                                "update:modelValue":(v:string)=>{
                                    if(props.formData)
                                        {props.formData[propName]=v}
                                }
                            }
                            return prev;
                        },{} as { [key: string]: { modelValue: any; "update:modelValue": (v: any) => void } }),
                        styleContent:block.styleContent!,
                        son:block.son,
                    });
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