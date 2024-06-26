import { computed, defineComponent, defineExpose } from "vue";
import '../declare/declare';
import emit from '../declare/Event'
import '../style/editorContent.scss';
import { userData, containerData } from "../stores";
import { registerConfig as config } from "./blocksConfig";
import { storeToRefs } from "pinia";
import { cloneDeep, drop, find } from "lodash";

export default defineComponent({
    props: {
        formData: {
            type: Object
        }
    },
    setup(props) {
        const useStore = userData();
        const useContainer = containerData();
        const { container } = useStore
        const { containerBlocks } = storeToRefs(useContainer);
        // index记录的是编辑器组件中已经放置了多少个组件，同时方便编辑器组件中的拖拽
        let index: number = 0;
        // id指的是页面中要渲染的是什么组件，display表示的是该组件是行元素还是块元素，这个数据是editorLeft文件发送过来的
        let id: any = null;
        let display: boolean | null = null;
        emit.on('addComponent', (message) => {
            id = message.id;

            if (message.display == 'true') {
                display = true;
            }
            else {
                display = false;
            }
        })
        emit.on('indexChange', (message) => {
            if (message == 'back') {
                index--;
            }
            else if (message == 'advance') {
                index++;
            }
            else if (message == 'clear') {
                index = 0;
            }
        })
        // flag接收到的是页面中组件出现拖拽发送过来的信息，如果flag中有值就是页面编辑器中拖拽的组件，没有就是左侧组件库中拖拽过来的组件
        let flag: string | null = null;
        emit.on('editorIndrag', (message) => {
            flag = message;
        })
        // 计算属性，计算页面编辑器的高度
        const containerStyle = computed(() => ({
            height: container.height + 'px'
        }))

        const unfocus = computed(() => containerBlocks.value.filter((item: block) => item.focus = false))
        // 实现清空页面选中元素的函数
        const clear = () => {
            useContainer.clearFocus();
            useStore.changeLastFocus({})

        }
        // 实现选中组件的函数
        const componentMousedown = (e: MouseEvent, block: any) => {
            // e.preventDefault();
            console.log("down");
            
            e.stopPropagation();
            // 获取到最外层的comBox盒子
            const ele = findcom((e.target as HTMLElement));
            // 判断点击到的最外层盒子的父元素是不是容器组件
            if (!(ele.parentElement as HTMLElement).classList.contains('container')) {
                if (e.shiftKey) {
                    block.focus = !block.focus;
                    useStore.changeLastFocus(block)
                }
                else {
                    if (!block.focus) {
                        clear();
                        block.focus = true;
                        useStore.changeLastFocus(block);
                    }
                    else {
                        block.focus = false;
                    }

                }
            }
        }

        // dragIndex表示的此时被拖拽的元素的index,newList表示的是拖拽替换的新表，numIndex表示的是要被替换的位置
        let dragIndex: number = 0;
        let newList: Array<any>;
        let numIndex: number;
        // 定义一个移除编辑器中关于辅助线类的函数
        const clearline = (com: Element) => {
            if (com.classList.contains('leftline')) {
                com.classList.remove('leftline');
            }
            else if (com.classList.contains('rightline')) {
                com.classList.remove('rightline');
            }
            else if (com.classList.contains('topline')) {
                com.classList.remove('topline');
            }
            else if (com.classList.contains('bottomline')) {
                com.classList.remove('bottomline');
            }
        }
        // 定义一个添加编辑器中关于辅助线类的函数
        const addline = (com: Element, dgindex: number, bdgindex: number) => {
            // 当拖拽的元素的index小于覆盖元素的index时，意味着要插入在后面，辅助线在左边或者下边
            if (dgindex < bdgindex) {
                // 当被覆盖的元素是行内元素时，添加辅助线在左边
                if (com.classList.contains('inline')) {
                    com.classList.add('rightline');
                }
                else {
                    com.classList.add('bottomline');
                }
            }
            else {
                if (com.classList.contains('inline')) {
                    com.classList.add('leftline');
                }
                else {
                    com.classList.add('topline');
                }
            }
        }
        // 定义一个递归获取祖先元素是组件盒子comBox的函数
        const findcom = (com: Element): Element => {
            if (com.classList.contains('editorContainer')) return com;//如果是递归到了最外层的editorContainer,说明没找到组件盒子
            if (com.classList.contains('comBox')) {
                return com;
            }
            else {
                const comparent = com.parentElement!;
                return findcom(comparent);
            }
        }

        // 定义两个个鼠标滑动预选效果的函数
        const mouseenter = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).classList.contains('componentDisplay')) {
                (e.target as HTMLElement).classList.add('preSelect');
            }
        }
        const mouseleave = (e: MouseEvent) => {
            if ((e.target as HTMLElement).classList.contains('preSelect')) {
                (e.target as HTMLElement).classList.remove('preSelect');
            }
        }

        const dragstart = (e: DragEvent) => {
            e.stopPropagation();
            console.log("dragstart:"+JSON.stringify(newList));
            // if(){}
            // 在拖拽开始的时候记录下拖拽替换前的编辑器中的组件列表，发送到Command文件中，方便撤回操作
            const oldState = cloneDeep(containerBlocks.value);
            emit.emit('record', oldState)

            // 发射标记为编辑器内拖拽的数据到下面增添数据的函数中
            emit.emit('editorIndrag', 'inDrag');

            // 获取被拖拽元素的index并将其转化为number类型
            const index = (e.target as HTMLElement).getAttribute('index');
            dragIndex = parseInt(index!);
            (e.target as HTMLElement).style.opacity = '0';
        }

        //在换位结束之后需要去对编辑器组件中的组件对象中的index进行重新的赋值，具体来说就是将下标定位index的值
        const dragenter = (e: DragEvent) => {
            console.log("dragenter");

            // 当拖拽的组件是编辑器中的组件时调用函数
            if (flag == 'inDrag') {
                e.stopPropagation();
                const target = findcom((e.target as HTMLElement));
                const index = target.getAttribute('index');
                if (index) {
                    numIndex = parseInt(index);
                    if (dragIndex !== numIndex) {
                        // 这里需要获取编辑器中组件列表,注意这里要将编辑器中的组件列表做一个深拷贝
                        newList = cloneDeep(containerBlocks.value);
                        const source = newList[dragIndex];
                        console.log("splice");
                        
                        newList.splice(dragIndex, 1);
                        newList.splice(numIndex, 0, source);
                        // 将重新排列好的数组中的index重置一遍
                        newList.map((li, i) => {
                            (li as { index: number }).index = i;
                        })
                    }
                }
            }
        }
        const dragleave = (e: DragEvent) => {
            console.log("dragleave");

            e.stopPropagation();
            // 离开当前组件的时候将该组件显示的辅助线删除
            const target = findcom((e.target as HTMLElement))
            clearline(target);
        }

        //左侧组件库中拖拽到已有组件上可以随意插入
        const dragover = (e: DragEvent) => {
            e.stopPropagation();
            e.preventDefault();
            // 通过递归函数找到最外层中的index
            const target = findcom((e.target as HTMLElement));
            console.log("over:" + target.classList.contains('containerBox'));
            const blockIndex = parseInt(target.getAttribute('index')!);
            // 拖到容器组件 会给容器组件添加样式 使其变色 表示松手drop时会添加到容器组件中
            if (target.classList.contains('containerBox')) {
                target.classList.add('overContainer');
                return;
            }
            else {
                // 没有拖进容器组件 移除所有容器组件的变色样式
                const Boxes = document.querySelectorAll('.containerBox')
                Boxes.forEach(item => item.classList.remove('overContainer'))
            }
            if (flag == "inDrag") {
                e.dataTransfer!.dropEffect = 'move';
                // 给找到的最外层的盒子添加辅助线
                addline(target, dragIndex, blockIndex);
            }
            else {
                // 从左侧组件库拖进来 并且要进行换位 显示线条line
                numIndex = parseInt(target.getAttribute('index')!)
                // 由于是刚拖进来的 还未渲染在页面上的组件 本应该传入的dragIndex即为全局的index
                addline(target, index, blockIndex);
            }

        }

        const dragend = (e: DragEvent) => {
            console.log("end");

            // console.log(newList);
            // 将拖拽完成之后的编辑器的组件列表发送到Command文件中，方便前进操作
            emit.emit('update', newList);
            //编辑器中的组件拖拽松手，更新数据，重新渲染页面
            newList && useContainer.update(newList);
            console.log("newnew:"+JSON.stringify(containerBlocks.value));
            
            // 只有当页面开始重新渲染的时候，才可以替换原来的index
            dragIndex = numIndex;
            (e.target as HTMLElement).style.opacity = '1';
            // 拖拽结束的时候，将页面中的line类的元素中的line类移除
            const lines = document.querySelectorAll('[class*="line"]');
            Array.from(lines).forEach((line: Element) => {
                clearline(line);
            })
        }
        // 如果做容器中的组件的拖拽的话，就需要做到判断拖拽停止的元素是什么
        const drop = (e: DragEvent) => {
            // 判断的flag是最上面接收到的flag
            console.log("drop");

            // if (flag != 'inDrag') {
            // 进入到容器组件中，该组件添加到容器组件中去
            const target = findcom(e.target as HTMLElement)
            // 判断有没有找到组件盒子 并且组件盒子是容器
            if (!target.classList.contains('editorContainer') && target.classList.contains('containerBox')) {
                const containerIndex: number = parseInt(target.getAttribute('index')!)  //找到目标容器组件的index
                console.log("index " + containerIndex);
                let newData: object
                if (flag !== 'inDrag') {
                    newData = {
                        focus: false,
                        key: id,
                        display: display,
                        id: new Date().getTime(),
                        props: {},
                        model: {},
                        styleContent: {},
                        son: [],
                        // sonIndex:
                    }
                }
                else {
                    console.log("in dragIndex:"+dragIndex);
                    newList=cloneDeep(containerBlocks.value)
                    console.log(JSON.stringify(newList));
                    newData = newList[dragIndex];
                    console.log("dragDat:"+JSON.stringify(newData));
                    
                    Reflect.deleteProperty(newData,"index"); //由于变成了子组件 没有了index属性 ??子组件需不需要index，如果需要怎么赋值??
                    newList.splice(dragIndex,1);
                    index--;
                    newList.map((li, i) => {
                        (li as { index: number }).index = i;
                    })
                    console.log("Del dragDat:"+JSON.stringify(newList));

                    useContainer.update(newList);
                    console.log("update:"+JSON.stringify(containerBlocks.value));

                }
                useStore.addSon(containerIndex, newData);
                console.log("spn:"+JSON.stringify(containerBlocks.value));

                //拖进容器组件之后 移除所有容器组件的变色样式
                const Boxes = document.querySelectorAll('.containerBox')
                Boxes.forEach(item => item.classList.remove('overContainer'))
            }
            //左侧组件拖拽到页面，给pinia仓库中添加一条新的数据
            else if(!dragIndex){
                useContainer.addData({
                    //标记组件是否被选中
                    focus: false,
                    //标记组件是什么类型，要怎么渲染
                    key: id,
                    //标记组件是行内元素还是块元素
                    display: display,
                    //标记组件是编辑器中第几个组件
                    index: index,
                    id: new Date().getTime(),  //时间戳id 方便获取元素
                    props: {},
                    model: {},
                    styleContent: {},
                    // 新增一个该组件中子组件数组
                    son: []
                })

                // 说明从左边组件库拖进来时 和其他已存在的组件进行了换位
                if (target.classList.contains('comBox')) {
                    dragIndex = index;
                    if (dragIndex !== numIndex) {
                        // 这里需要获取编辑器中组件列表,注意这里要将编辑器中的组件列表做一个深拷贝
                        newList = cloneDeep(containerBlocks.value);
                        const source = newList[dragIndex];
                        newList.splice(dragIndex, 1);
                        newList.splice(numIndex, 0, source);
                        // 将重新排列好的数组中的index重置一遍
                        newList.map((li, i) => {
                            (li as { index: number }).index = i;
                        })
                    }
                    useContainer.update(newList);

                }
                //更新此时编辑器中有多少个组件,0即为1个
                index++;
            }
            // 拖拽结束的时候，将页面中的line类的元素中的line类移除
            const lines = document.querySelectorAll('[class*="line"]');
            Array.from(lines).forEach((line: Element) => {
                clearline(line);
            })
            //记录此时最新的状态，将该最新状态通过事件发射器，发送给Command文件中，方便撤回操作
            console.log("C:"+JSON.stringify(containerBlocks.value));
            
            const newState = cloneDeep(containerBlocks.value);
            emit.emit('update', newState);
            
        }
        return () => (
            <div>
                <div class="editorCanva">
                    <div class="editorContainer" style={containerStyle.value} ondragover={dragover} onMousedown={clear} onDrop={drop}>
                        {
                            (containerBlocks.value.map((block: block) => { 
                                const component = config.componentMap[block.key];
                                const renderComponet = component.render({
                                    props: (block as { props: Object }).props,
                                    model: Object.keys(block.model || {}).reduce((prev, modelName) => {
                                        let propName = block.model[modelName]  //"username"
                                        prev[modelName] = {
                                            modelValue: props.formData?.[propName],
                                            "update:modelValue": (v: string) => {
                                                if (props.formData) { props.formData[propName] = v }
                                            }
                                        }
                                        return prev;
                                    }, {} as { [key: string]: { modelValue: any; "update:modelValue": (v: any) => void } }),
                                    styleContent: block.styleContent!,
                                    son: block.son,
                                });
                                const classMo = ['comBox'];
                                if ((block as { focus: boolean }).focus) {
                                    classMo.push('componentDisplay');
                                }
                                if (!(block as { display: boolean }).display) {
                                    classMo.push('inline')
                                }

                                if (component.container) {
                                    // 表示是容器组件
                                    classMo.push('containerBox')
                                }
                                return <div
                                    index={(block as { index: number }).index}
                                    draggable
                                    style={{ ...block.styleContent }}
                                    class={classMo.join(' ')}
                                    onMousedown={(e: MouseEvent) => componentMousedown(e, block)}
                                    ondragstart={dragstart}
                                    ondragleave={dragleave}
                                    ondragenter={dragenter}
                                    // ondragover={dragover}
                                    ondragend={dragend}
                                    onMouseenter={mouseenter}
                                    onMouseleave={mouseleave}
                                // onDrop={drop}
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