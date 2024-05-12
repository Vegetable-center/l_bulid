import { computed, defineComponent, reactive, ref, watch } from "vue";
import { containerData,userData } from "../stores";
import { registerConfig } from "./blocksConfig";
import { ElForm, ElFormItem, ElInputNumber,ElButton, ElInput, ElColorPicker, ElSelect, ElOption } from "element-plus";
import deepcopy from "deepcopy";

export default defineComponent({
    setup(props, ctx) {
        const focusData=userData()
        const lastfocus=computed(()=>focusData.lastfocus)
        const container=computed(()=>focusData.container)
        const componentMap=registerConfig.componentMap
        const {changeData}=containerData()
        const state=reactive({
            editData:{}
        })
        const reset=()=>{            
            if(!lastfocus.value){
                state.editData=deepcopy(container.value)
            }else{
                state.editData=deepcopy(lastfocus.value)
            }
        }
        const apply=()=>{
            changeData((lastfocus.value as {id:string}).id,state.editData)
        }
        watch(()=>lastfocus,reset,{immediate:true,deep:true})
        interface PropConfig{
            label:string,
            type: 'input' | 'color' | 'select' | 'table',
            options:Array<Object>
        }
        interface PropComponent{
            [propName:string]:PropConfig
        }
        return ()=>{
            let content=[]
            
            if(JSON.stringify(lastfocus.value)==="{}"){
                
                content.push(<>
                    <ElFormItem label="容器宽度">
                        <ElInputNumber v-model={(state.editData as {width:number}).width} />
                    </ElFormItem>
                    <ElFormItem label="容器高度">
                        <ElInputNumber v-model={(state.editData as {height:number}).height} />
                    </ElFormItem>
                </>)
            }
            else{
                let lastFocus=lastfocus.value
                let component=componentMap[(lastFocus as {key:string}).key]
                if(component && component.props){
                    content.push(Object.entries((component as {props:PropComponent}).props).map(([propName,propConfig])=>{
                        if (propConfig.type === 'input' || propConfig.type === 'color' || propConfig.type === 'select' || propConfig.type === 'table') {
                            
                            const getProp=()=>{
                                switch(propConfig.type){
                                    case 'input':
                                        return <ElInput v-model={(state.editData as {props:any}).props[propName]}></ElInput>;
                                    case 'color':
                                        return <ElColorPicker v-model={(state.editData as {props:any}).props[propName]}></ElColorPicker>;
                                    case 'select':
                                        return <ElSelect v-model={(state.editData as {props:any}).props[propName]}>
                                            {propConfig.options.map(item=>{
                                                return <ElOption label={(item as {label:string}).label} value={(item as {value:string}).value}></ElOption>
                                            })}
                                        </ElSelect>;
                                    case 'table':
                                        return
                                    default:
                                        return null;
                                }
                            }
                            return <ElFormItem label={propConfig.label}>{getProp()}</ElFormItem>
                        }
                    }))
                }
                if(component && component.model){
                    content.push(Object.entries((component.model)).map(([modelName,label])=>{
                        <ElFormItem label={label}>
                            <ElInput v-model={(state.editData as {model:Model}).model[modelName]}></ElInput>;
                        </ElFormItem>
                    }))
                }
                
            }
            return <ElForm labelPosition="top" style="padding:30px">
            {content}
            <ElFormItem>
                <ElButton type="primary" onClick={()=>apply()}>应用</ElButton>
                <ElButton onClick={reset}>重置</ElButton>
            </ElFormItem>
        </ElForm>
        }
    },
})