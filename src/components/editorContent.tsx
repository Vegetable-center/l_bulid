import { computed, defineComponent} from "vue";
import '../declare/declare';
import '../style/editorContent.scss';
import { userData , containerData} from "../stores";
import { registerConfig as config } from "./blocksConfig";
import { storeToRefs } from "pinia";

export default defineComponent({
    props:{
        formData:{
            type:Object
        }
    },
    setup(props){
        const useStore=userData();
        const useContainer=containerData();
        const {container} =useStore
        const {containerBlocks} = storeToRefs(useContainer);
        let top:any=null;
        let left:any=null;

        const containerStyle = computed(() => ({
            height:container.height+'px'
        }))
        // 计算属性，计算被选中的组件有多少个
        const focusComponent = computed(() => {
            let focus:Array<any>=[];
            let unfocus:Array<any>=[];
            containerBlocks.value.forEach(block => {
                ((block as {focus:boolean}).focus?focus:unfocus).push(block);
            })
            return {focus,unfocus}
        })

        // 实现清空页面选中元素的函数
        const clear =() => {
            useContainer.clearFocus();
            useStore.changeLastFocus({})

        }

        //计算组件在编辑器中的位置的函数
        const location:any=(e:MouseEvent) =>{
            const nwtop=e.clientY;
            const nwleft=e.clientX;
            console.log("水平位置："+nwleft+","+"垂直位置："+nwtop);
            focusComponent.value.focus.map(item => {
                item.top=`${nwtop-top}`;
                item.left=`${nwleft-left}`;
            })
        }
        // 实现选中组件的函数
        const componentMousedown =(e:MouseEvent,block:any) => {
            // 取消默认行为
            e.preventDefault();
            e.stopPropagation();
            // 获取大的编辑器组件
            const Edcontainer = document.querySelector('.editorContainer');
            const number=Edcontainer?.getBoundingClientRect()
            left=number?.left;
            top=number?.top;
            if(e.shiftKey){
                block.focus=!block.focus;
                useStore.changeLastFocus(block)
            }
            else {
                if(!block.focus){
                    clear();
                    block.focus=true;
                    useStore.changeLastFocus(block)
                    Edcontainer?.addEventListener('mousemove',location)
                    Edcontainer?.addEventListener('mouseup',()=> {
                        Edcontainer.removeEventListener('mousemove',location)
                    })
                }
                else {
                    Edcontainer?.addEventListener('mousemove',location)
                    Edcontainer?.addEventListener('mouseup',()=> {
                        Edcontainer.removeEventListener('mousemove',location)
                    })
                }
            }
        }

        return ()=> (
            <div>
                <div class="editorCanva">
                    <div class="editorContainer" style={containerStyle.value} onMousedown={clear}>
                        {
                            (containerBlocks.value.map((block:block) => {
                                const component=config.componentMap[block.key];
                                console.log("imggg:"+JSON.stringify((block as {props:Object}).props));
                                
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
                                });
                                return <div
                                    style={{position:"absolute",top:block.top+'px',left:block.left+'px'}}
                                    class={block.focus?'componentDisplay':''}
                                    onMousedown={(e:MouseEvent) => componentMousedown(e,block)}
                                 >
                                    {renderComponet}
                                </div>
                            }))
                        }
                    </div>
                </div>
            </div>
        );
    } 
})