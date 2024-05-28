import { createBlock, defineComponent } from "vue";
import '../declare/declare';
import emit from '../declare/Event'
import '../style/editorLeft.scss'
import '../icon/icon.css' 
import { userData,containerData} from "../stores";
import { registerConfig as config } from "./blocksConfig";
import { cloneDeep } from "lodash";

export default defineComponent({
    components: {
        ElButton,
    },
    setup(){
        const data=userData();
        const useContainer=containerData();
        // const blocks:Array<block>=data.blocks;
        const smallBlocks=config.smallComponentList;
        const bigBlocks=config.bigComponentList;
        let flag:number=0;
        
        let key: string;
        let props:Object
        //这个方法是点击左侧组件库的箭头所触发的组件库移动
        const btClick= () => {
            const ele=document.querySelector('.moveBox') as HTMLElement | null;
            const bt=document.querySelector('.icon-shuangjiantou') as HTMLElement | null;
            if(flag==0){
                if(ele){
                    ele.parentElement?ele.parentElement.classList.remove('appear'):console.log('获取left元素失败')
                    ele.parentElement?ele.parentElement.classList.add('hidden'):console.log('获取left元素失败')
                    bt?bt.style.transform='rotate(180deg)':console.log("按钮旋转失败");
                    flag=1;
                }
            }
            else {
                if (ele) {
                    ele.parentElement ? ele.parentElement.classList.remove('hidden') : console.log('获取left元素失败')
                    ele.parentElement ? ele.parentElement.classList.add('appear') : console.log('获取left元素失败')
                    bt ? bt.style.transform = 'rotate(0deg)' : console.log("按钮旋转失败");
                    flag = 0;
                }
            }

        }
        // 这个方法是点击抽屉组件的标题所触发的移动函数
        const smbtClick = (e:MouseEvent) =>{
            const comBox=(e.target as HTMLElement)?.nextElementSibling?.firstElementChild;
            const comMoveBox=(e.target as HTMLElement)?.nextElementSibling;
            const jiantou=(e.target as HTMLElement).firstElementChild;
            const Boxhg=(comBox?.clientHeight as number);
            if((e.target as HTMLElement).id==='hideTrue'){
                (jiantou as HTMLElement).style.transform='rotate(-90deg)';
                (e.target as HTMLElement).id='hideFalse';
                (comBox as HTMLElement).style.transform=`translateY(-${Boxhg}px)`;
                (comMoveBox as HTMLElement).style.height='0px';
                
            }
            else {
                (jiantou as HTMLElement).style.transform='rotate(0deg)';
                (e.target as HTMLElement).id='hideTrue';
                (comBox as HTMLElement).style.transform=`translateY(0px)`;
                (comMoveBox as HTMLElement).style.height=`${Boxhg}px`;
                
            }
        }
        
        window.addEventListener('dragover',(e:DragEvent)=> {
            e.preventDefault();
        })

        const dragstart =(e:DragEvent) =>{
            //获取拖拽元素的id，将id通过事件发射器发送到editorContent文件中，进行组件添加
            const id = (e.target as HTMLElement)!.firstElementChild!.getAttribute('id');
            const display = (e.target as HTMLElement)!.firstElementChild!.getAttribute('display');
            console.log("idL:"+JSON.stringify((e.target as HTMLElement)!.firstElementChild));
            
            // 发送要进行渲染的数据到editorContent文件中
            emit.emit('addComponent',{
                id,
                display
            });
            // 发送标记此次拖拽时左侧组件库触发的还是页面中的编辑器触发的
            emit.emit('editorIndrag','outDrag')
            const oldState=cloneDeep(useContainer.containerBlocks)
            //记录此时为旧状态，将该旧状态通过事件发射器发送到Command文件中，方便撤回操作
            emit.emit('record',oldState);
        }
        return ()=> {
            return <div>
                <div class="moveBox">
                    <div class="bt" onClick={btClick}>
                            <i class="iconfont icon-shuangjiantou"></i>
                    </div> 
                    <div class="leftTitle">左侧组件库</div>
                    <div class='smallBlock'>
                        <div class="titleBlock" onClick={smbtClick} id="hideTrue">
                            <i class="iconfont icon-xianxingxiajiantou rotateBox"></i>
                            <div class="title">小组件</div>
                        </div>
                        <div class="comMoveBox">
                            <div class='blocksBox'>
                                {
                                    (smallBlocks.map((aBlock) => {
                                        const component=config.componentMap[aBlock.key]
                                        const renderComponet=component.preview();
                                        return <div class="smBox" draggable onDragstart={dragstart}>
                                            {renderComponet}
                                        </div>
                                    }))
                                }
                            </div>
                        </div>
                    </div>
                    <div class='smallBlock'>
                        <div class="titleBlock" onClick={smbtClick} id="hideTrue">
                            <i class="iconfont icon-xianxingxiajiantou rotateBox"></i>
                            <div class="title">大组件</div>
                        </div>
                        <div class="comMoveBox">
                            <div class='blocksBox'>
                                {
                                    (bigBlocks.map((aBlock) => {
                                        const component=config.componentMap[aBlock.key]
                                        
                                        const renderComponet=component.preview();
                                        return <div class="smBox" draggable onDragstart={dragstart}>
                                            {renderComponet}
                                        </div>
                                    }))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        };
    }
})