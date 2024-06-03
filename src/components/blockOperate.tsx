import { computed, defineComponent, reactive, ref, watch } from "vue";
import { containerData, userData } from "../stores";
import '../style/operate.scss'
import { registerConfig } from "./blocksConfig";
import { ElForm, ElFormItem, ElInputNumber, ElButton, ElInput, ElColorPicker, ElSelect, ElOption } from "element-plus";
import deepcopy from "deepcopy";

export default defineComponent({
    setup(props, ctx) {
        const focusData = userData()
        const lastfocus = computed(() => focusData.lastfocus)
        const container = computed(() => focusData.container)
        const componentMap = registerConfig.componentMap
        const { changeData } = containerData()
        // const len=computed(()=>(lastfocus.value as any).props.num.length)
        const state = reactive({
            editData: {},
        })
        const carouselNum=ref("2")  //轮播图片数量
        const inputNum = ref("2")  //输入的轮播图数量
        const menuInputNum=ref("4")  //输入的导航栏数量
        const menuNum=ref("4")  //导航栏数量
        const reset = () => {
            // 当没有最后一个选中的组件时
            if (!lastfocus.value) {
                state.editData = deepcopy(container.value)
            } else {
                state.editData = deepcopy(lastfocus.value)
            }
        }
        const confirmNum = () => {  //确认数量
            carouselNum.value = inputNum.value;
            (state.editData as { props: any }).props.num=reactive([]);
        }
        const confirmMenuNum = () => {  //确认数量
            menuNum.value = menuInputNum.value;
            (state.editData as { props: any }).props.linkTit=reactive([]);
            (state.editData as { props: any }).props.link=reactive([]);
        }
        // 当页面点击应用的时候就更新一次组件数据
        // 传入的是最后一次选中的组件的id和修改的组件对象
        const apply = () => {
            console.log(lastfocus.value)
            console.log(state.editData)
            changeData((lastfocus.value as { id: string }).id, state.editData)
        }

        // 监控最后一个选中的组件是否发生变化，发生变化的话就执行reset函数
        watch(() =>lastfocus, reset, { immediate: true,deep:true})

        interface PropConfig {
            label: string,
            type: 'input' | 'color' | 'select' | 'table',
            options: Array<Object>
        }
        interface PropComponent {
            [propName: string]: PropConfig
        }
        
        // 页面中绑定的键盘按下Enter事件
        function enter(e:KeyboardEvent){
            if(e.key=='Enter'){
                // console.log("按下回车了");
                apply();
            }
        }

        return () => {
            // content表示的是右侧控制台的样式
            let content = []

            // 如果没有选中任何组件，右侧控制台的样式
            if (JSON.stringify(lastfocus.value) === "{}") {
                content.push(<>
                    <ElFormItem label="容器宽度">
                        <ElInputNumber v-model={(state.editData as { width: number }).width} />
                    </ElFormItem>
                    <ElFormItem label="容器高度">
                        <ElInputNumber v-model={(state.editData as { height: number }).height} />
                    </ElFormItem>
                </>)
            }
            // 选中组建了，右侧控制台的样式
            else {
                let lastFocus = lastfocus.value
                // 获取页面中对应组件的配置对象
                let component = componentMap[(lastFocus as { key: string }).key];

                // 如果这个组件存在，并且该组件可以被修改样式
                if (component && component.props) {
                    content.push(Object.entries((component as { props: PropComponent }).props).map(([propName, propConfig]) => {
                        if (propConfig.type === 'input' && propName === 'num') {
                            // 说明是轮播图
                            if(!Array.isArray((state.editData as { props: any }).props[propName])){
                                (state.editData as { props: any }).props[propName]=reactive([])
                            }
                            let inputArray = []
                            
                            for (let i = 0; i < parseInt(carouselNum.value); i++) {
                                inputArray.push(<ElFormItem label={"图片链接"+(i+1)}><ElInput v-model={(state.editData as { props: any }).props[propName][i]}></ElInput></ElFormItem>)
                            }
                            return <>
                            <ElFormItem label={propConfig.label}>
                                <ElInput v-model={inputNum.value}></ElInput>
                                <ElButton onClick={confirmNum} type="primary" style={{marginTop:'10px'}}>确认</ElButton>
                            </ElFormItem>
                                {inputArray}
                            </>
                        }
                        else if (propConfig.type === 'input' && propName === 'linkTit') {
                            // 说明是轮播图
                            if(!Array.isArray((state.editData as { props: any }).props[propName])){
                                (state.editData as { props: any }).props[propName]=reactive([]);
                                (state.editData as { props: any }).props["link"]=reactive([]);
                            }
                            let inputArray = []
                            
                            for (let i = 0; i < parseInt(menuNum.value); i++) {
                                inputArray.push(<><ElFormItem label={"导航标题"+(i+1)}><ElInput v-model={(state.editData as { props: any }).props[propName][i]}></ElInput></ElFormItem>
                                <ElFormItem label={"导航链接"+(i+1)}><ElInput v-model={(state.editData as { props: any }).props["link"][i]}></ElInput></ElFormItem></>)
                            }
                            return <>
                            <ElFormItem label={propConfig.label}>
                                <ElInput v-model={menuInputNum.value}></ElInput>
                                <ElButton onClick={confirmMenuNum} type="primary" style={{marginTop:'10px'}}>确认</ElButton>
                            </ElFormItem>
                                {inputArray}
                            </>
                        }
                        else if (propConfig.type === 'input' || propConfig.type === 'color' || propConfig.type === 'select' || propConfig.type === 'table') {

                            const getProp = () => {
                                
                                switch (propConfig.type) {
                                    case 'input':
                                        return <ElInput v-model={(state.editData as { props: any }).props[propName]} onkeydown={enter} ></ElInput>;
                                    case 'color':
                                        return <ElColorPicker v-model={(state.editData as { props: any }).props[propName]}></ElColorPicker>;
                                    case 'select':
                                        return <ElSelect v-model={(state.editData as { props: any }).props[propName]}>
                                            {propConfig.options.map(item => {
                                                return <ElOption label={(item as { label: string }).label} value={(item as { value: string }).value}></ElOption>
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
                if (component && component.model) {
                    content.push(Object.entries((component.model)).map(([modelName, label]) => {
                        return <ElFormItem label={label}>
                            <ElInput v-model={(state.editData as { model: Model }).model[modelName]}></ElInput>
                        </ElFormItem>
                    }))
                }

            }
            return <ElForm labelPosition="top">
                {content}
                {<ElFormItem>
                    <ElButton type="primary" onClick={() => apply()}>应用</ElButton>
                    <ElButton onClick={reset}>重置</ElButton>
                </ElFormItem>}
            </ElForm>
        }
    },
})