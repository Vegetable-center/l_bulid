import { computed, defineComponent,} from "vue";
import '../declare/declare';
import emit from '../declare/Event'
import '../style/editorContent.scss';
import { userData , containerData} from "../stores";
import { registerConfig as config } from "./blocksConfig";
import { storeToRefs } from "pinia";
import { cloneDeep } from "lodash";

export default defineComponent({
    components:{
        ElButton,
    },
    setup(){
        const useStore=userData();
        const useContainer=containerData();
        const {container} =useStore
        const {containerBlocks} = storeToRefs(useContainer);
        // index记录的是编辑器组件中已经放置了多少个组件，同时方便编辑器组件中的拖拽
        let index:number=0;
        // id指的是页面中要渲染的是什么组件，display表示的是该组件是行元素还是块元素，这个数据是editorLeft文件发送过来的
        let id:any=null;
        let display:boolean|null=null;
        emit.on('addComponent',(message) => {
            id=message.id;
            if(message.display=='true'){
                display=true;
            }
            else {
                display=false;
            }
        })
        emit.on('indexChange',(message)=> {
            if(message=='back'){
                index--;
            }
            else if(message=='advance'){
                index++;
            }
            else if(message=='clear'){
                index=0;
            }
        })
        // flag接收到的是页面中组件出现拖拽发送过来的信息，如果flag中有值就是页面编辑器中拖拽的组件，没有就是左侧组件库中拖拽过来的组件
        let flag:string|null=null;
        emit.on('editorIndrag',(message)=>{
            flag=message;
        })
        // 计算属性，计算页面编辑器的高度
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
        // 实现选中组件的函数
        const componentMousedown =(e:MouseEvent,block:any) => {
            // e.preventDefault();
            e.stopPropagation();
            if(e.shiftKey){
                block.focus=!block.focus;
                console.log(focusComponent.value.focus)
            }
            else {
                if(!block.focus){
                    clear();
                    block.focus=true;
                }
                else {
                    block.focus=false;
                }
            }
        }

        // dragIndex表示的此时被拖拽的元素的index,newList表示的是拖拽替换的新表，numIndex表示的是要被替换的位置
        let dragIndex:number=0;
        let newList:Array<any>;
        let numIndex:number;
        // 定义一个移除编辑器中关于辅助线类的函数
        const clearline = (com:Element) => {
            if(com.classList.contains('leftline')){
                com.classList.remove('leftline');
            }
            else if(com.classList.contains('rightline')){
                com.classList.remove('rightline');
            }
            else if(com.classList.contains('topline')){
                com.classList.remove('topline');
            }
            else if(com.classList.contains('bottomline')){
                com.classList.remove('bottomline');
            }
        }
        // 定义一个添加编辑器中关于辅助线类的函数
        const addline = (com:Element,dgindex:number,bdgindex:number) => {
            // 当拖拽的元素的index小于覆盖元素的index时，意味着要插入在后面，辅助线在左边或者下边
            if(dgindex<bdgindex){
                // 当被覆盖的元素是行内元素时，添加辅助线在左边
                if(com.classList.contains('inline')){
                    com.classList.add('rightline');
                }
                else {
                    com.classList.add('bottomline');
                }
            }
            else {
                if(com.classList.contains('inline')){
                    com.classList.add('leftline');
                }
                else {
                    com.classList.add('topline');
                }
            }
        }
        // 定义一个递归获取祖先元素是组件盒子comBox的函数
        const findcom = (com:Element):Element => {
            if(com.classList.contains('comBox')){
                return com;
            }
            else {
                const comparent=com.parentElement!;
                return findcom(comparent);
            }
        }

        const dragstart =(e:DragEvent) => {
            e.stopPropagation();
            // 在拖拽开始的时候记录下拖拽替换前的编辑器中的组件列表，发送到Command文件中，方便撤回操作
            const oldState=cloneDeep(containerBlocks.value);
            emit.emit('record',oldState)

            // 发射标记为编辑器内拖拽的数据到下面增添数据的函数中
            emit.emit('editorIndrag','inDrag');

            // 获取被拖拽元素的index并将其转化为number类型
            const index=(e.target as HTMLElement).getAttribute('index');
            dragIndex=parseInt(index!);

            (e.target as HTMLElement).style.opacity='0';
        }

        //在换位结束之后需要去对编辑器组件中的组件对象中的index进行重新的赋值，具体来说就是将下标定位index的值
        const dragenter= (e:DragEvent) => {
            // 当拖拽的组件是编辑器中的组件时调用函数
            if(flag=='inDrag'){
                e.stopPropagation();
                const index = (e.target as HTMLElement).parentElement!.getAttribute('index');
                if(index){
                    numIndex=parseInt(index);
                    if(dragIndex!==numIndex){
                        // 这里需要获取编辑器中组件列表,注意这里要将编辑器中的组件列表做一个深拷贝
                        newList=cloneDeep(containerBlocks.value);
                        const source=newList[dragIndex];
                        newList.splice(dragIndex,1);
                        newList.splice(numIndex,0,source);
                        // 将重新排列好的数组中的index重置一遍
                        newList.map((li,i) => {
                            (li as {index:number}).index=i;
                        })
                    }
                }
            }
        }
        const dragleave = (e:DragEvent) => {
            e.stopPropagation();
            // 离开当前组件的时候将该组件显示的辅助线删除
            const test=(e.target as HTMLElement).parentElement!;
            clearline(test);
        }

        //左侧组件库中拖拽到已有组件上可以随意插入
        const dragover= (e:DragEvent) => {
            if(flag=="inDrag"){
                e.preventDefault();
                e.dataTransfer!.dropEffect='move';
                // 获得被覆盖元素的宽高，这里通过的是类名comBox进行辨别是否是编辑器中最外面一层的盒子，此时组件较为简单，不需要comBox的分辨，后续需要这部分的代码进行完善
                const eparent=(e.target as HTMLElement).parentElement;
                // 这里做的是编辑器中拖拽开始的辅助线的添加
                if(eparent?.classList.contains('comBox')){
                    const index=parseInt((e.target as HTMLElement).parentElement!.getAttribute('index')!);
                    // console.log('此时被覆盖的元素的index为：'+index)
                    addline(eparent,dragIndex,index);
                }
                // 这做的是页面中经过按钮的特殊处理
                else if(eparent?.className=='el-button'){
                    const index=parseInt((e.target as HTMLElement).parentElement?.parentElement!.getAttribute('index')!);
                    const com=findcom(eparent);
                    addline(com,dragIndex,index);
                }
            } 
        }
        const dragend = (e:DragEvent) => {
            // 将拖拽完成之后的编辑器的组件列表发送到Command文件中，方便前进操作
            emit.emit('update',newList);
            //编辑器中的组件拖拽松手，更新数据，重新渲染页面
            newList&&useContainer.update(newList);
            // 只有当页面开始重新渲染的时候，才可以替换原来的index
            dragIndex=numIndex;
            (e.target as HTMLElement).style.opacity='1';
            // 拖拽结束的时候，将页面中的line类的元素中的line类移除
            const lines=document.querySelectorAll('[class*="line"]');
            Array.from(lines).forEach((line:Element) => {
                clearline(line);
            })
        } 
        const drop= (e:DragEvent) => {
            // 判断的flag是最上面接收到的flag
            if(flag!='inDrag'){
                //此时组件拖拽完成，给pinia仓库中添加一条新的数据
                useContainer.addData({
                    //标记组件是否被选中
                    focus:false,
                    //标记组件是什么类型，要怎么渲染
                    key:id,
                    //标记组件是行内元素还是块元素
                    display:display,
                    //标记组件是编辑器中第几个组件
                    index:index,
                })
                //更新此时编辑器中有多少个组件,0即为1个
                index++;
                //记录此时最新的状态，将该最新状态通过事件发射器，发送给Command文件中，方便撤回操作
                const newState=cloneDeep(containerBlocks.value);
                emit.emit('update',newState);
            }
        }
        return ()=> (
            <div>
                <div class="editorCanva">
                    <div class="editorContainer" style={containerStyle.value} onMousedown={clear} onDrop={drop}>
                        {
                            (containerBlocks.value.map(block => {
                                const component=config.componentMap[(block as {key:string}).key];
                                const renderComponet=component.render();
                                const classMo=['comBox'];
                                if((block as {focus:boolean}).focus){
                                    classMo.push('componentDisplay');
                                }
                                if(!(block as {display:boolean}).display){
                                    classMo.push('inline')
                                }
                                return <div
                                    index={(block as {index:number}).index}
                                    draggable
                                    class={classMo.join(' ')}
                                    onMousedown={(e:MouseEvent) => componentMousedown(e,block)}
                                    ondragstart={dragstart}
                                    ondragleave={dragleave}
                                    ondragenter={dragenter}
                                    ondragover={dragover}
                                    ondragend={dragend}
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