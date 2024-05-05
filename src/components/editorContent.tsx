import { computed, defineComponent,} from "vue";
import '../declare/declare';
import '../style/editorContent.scss';
import { userData , containerData} from "../stores";
import { registerConfig as config } from "./blocksConfig";
import { storeToRefs } from "pinia";

export default defineComponent({
    components:{
        ElButton,
    },
    setup(){
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
                console.log(focusComponent.value.focus)
            }
            else {
                if(!block.focus){
                    clear();
                    block.focus=true;
                    Edcontainer?.addEventListener('mousemove',location)
                    Edcontainer?.addEventListener('mouseup',()=> {
                        Edcontainer.removeEventListener('mousemove',location)
                    })
                }
                else {
                    // block.focus=false;
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
                            (containerBlocks.value.map(block => {
                                const component=config.componentMap[(block as {key:string}).key];
                                const renderComponet=component.render();
                                // console.log((block as {top:Number}).top)
                                // console.log((block as {left:Number}).left)
                                return <div
                                    style={{position:"absolute",top:(block as {top:Number}).top+'px',left:(block as {left:Number}).left+'px'}}
                                    class={(block as {focus:boolean}).focus?'componentDisplay':''}
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