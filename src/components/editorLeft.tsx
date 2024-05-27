import { defineComponent } from "vue";
import '../declare/declare';
import '../style/editorLeft.scss'
import '../icon/icon.css'
import { userData, containerData } from "../stores";
import { registerConfig as config } from "./blocksConfig";


export default defineComponent({
    components: {
        ElButton,
    },
    setup() {
        const data = userData();
        const container = containerData();
        const blocks: Array<block> = data.blocks;
        let flag: number = 0;
        let dragging: boolean = false;
        let cloneEl: any = null;
        let key: string;
        let props:Object
        //这个方法是点击左侧组件库的箭头所触发的组件库移动
        const btClick = () => {
            console.log("我被点击到了");
            const ele = document.querySelector('.moveBox') as HTMLElement | null;
            const bt = document.querySelector('.icon-shuangjiantou') as HTMLElement | null;
            if (flag == 0) {
                if (ele) {
                    ele.parentElement ? ele.parentElement.classList.remove('appear') : console.log('获取left元素失败')
                    ele.parentElement ? ele.parentElement.classList.add('hidden') : console.log('获取left元素失败')
                    bt ? bt.style.transform = 'rotate(180deg)' : console.log("按钮旋转失败");
                    flag = 1;
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

        const movedown = (e: MouseEvent, block: Object) => {
            document.querySelector('.editorContainer')?.addEventListener('mouseup', (mouseup as EventListenerOrEventListenerObject))
            dragging = true;
            key = (block as {key:string}).key;
            props=(block as {props:string}).props;
            
            if (e.target) {
                const isContent = (e.target as HTMLElement).className;
                //如果点击到的是外面的盒子
                if (isContent == "smBox") {
                    console.log("拿到的是外面的盒子，类名是：" + isContent)
                    cloneEl = (e.target as Node).firstChild?.cloneNode(true);
                    (cloneEl as Element).classList.add('flutter');
                    (e.target as Node).parentElement?.appendChild(cloneEl)
                }
                //如果点击到的时候里面的组件内容
                else {

                    //这里的问题是点击到组件里面的内容会出现组件样式出现问题，此时需要看点击的内部内容来写
                    console.log(e.target)
                    // 直接获取smBox
                    const smBox = document.querySelector('.smBox');
                    cloneEl = smBox?.firstChild?.cloneNode(true);
                    (cloneEl as Element).classList.add('flutter');
                    (smBox as Node).parentElement?.appendChild(cloneEl)
                    // cloneEl=(e.target as Node).cloneNode(true);
                    // (cloneEl as Element).classList.add('flutter');
                    // (e.target as Node).parentElement?.parentElement?.appendChild(cloneEl)
                }
            }
        }

        window.addEventListener('mousemove', (e) => {
            if (dragging && cloneEl) {
                // 将页面中的元素暂时设置为不可选中
                document.body.style.userSelect = 'none';

                const left = cloneEl.clientWidth / 2;
                const top = cloneEl.clientHeight * 2;
                cloneEl.style.left = `${e.clientX - left}px`;
                cloneEl.style.top = `${e.clientY - top}px`;
            }
        })

        const mouseup = (e: MouseEvent) => {
            console.log(e.target)
            const beleft = cloneEl.clientWidth / 2;
            const betop = cloneEl.clientHeight + cloneEl.clientHeight / 2;
            if (dragging && (e.target as HTMLElement).className == 'editorContainer') {
                const blcoksBox: HTMLElement | null = document.querySelector('.blocksBox');
                const last: any = blcoksBox?.lastChild;
                blcoksBox?.removeChild(last);

                console.log((e.target as HTMLElement)?.offsetLeft)
                const left = e.clientX - (e.target as HTMLElement)?.offsetLeft - beleft;
                const top = e.clientY - (e.target as HTMLElement)?.offsetTop - betop;
                // 将拖拽的组件信息写入到Store仓库中

                const newData = {
                    id:new Date().getTime(),  //时间戳id 方便获取元素
                    focus: false,
                    key: key,
                    top: top,
                    left: left,
                    props:{},
                    model:{},
                    styleContent:{}
                }
                container.addData(newData);
                dragging = false;
                document.body.style.userSelect = '';
            }
        }
        return () => {
            return <div>
                <div class="moveBox">
                    <div class="bt" onClick={btClick}>
                        <i class="iconfont icon-shuangjiantou"></i>
                    </div>
                    <div class="leftTitle">左侧组件库</div>
                    <div class='blocksBox'>
                        {
                            // console.log(blocks)
                            (config.componentList.map((aBlock) => {
                                console.log("key" + aBlock.key);

                                const component = config.componentMap[aBlock.key]
                                const renderComponet = component.preview();
                                return <div class="smBox" onMousedown={(e: MouseEvent) => movedown(e, aBlock)}>
                                    {renderComponet}
                                </div>
                            }))
                        }
                    </div>
                </div>
            </div>
        };
    }
})