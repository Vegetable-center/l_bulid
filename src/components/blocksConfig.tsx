import { ElCarousel, ElCarouselItem, ElForm, ElFormItem, ElInput, ElMenu, ElMenuItem,ElButton, ElCard, ElLink } from "element-plus";
import DForm from "./DForm.vue";
import DMenu from "./DMenu.vue";
import DCard from "./DCard.vue";
import DCarousel from "./DCarousel.vue";
import Container from "./Container";

function createBlock(){
    const smallComponentList:Array<any>=[];
    const bigComponentList:Array<any>=[];
    const componentMap:{[key:string]:Component}={}
    return {
        smallComponentList,
        bigComponentList,
        componentMap,
        register:(component?:Component)=> {
            if(component){
                component.componentType==="big"?bigComponentList.push(component):smallComponentList.push(component);
                componentMap[component.key] = component;
            }
            else {
                console.log("component 没有正确传入")
            }
        }
    }
}

export let registerConfig=createBlock()
const createInputProp=(label: string)=>({type:'input',label})
const createColorProp=(label:string)=>({type:'color',label})
const createSelectProp=(label:string,options:Array<Object>)=>({type:'select',label,options})
const createFormProp=(label:string,table:Array<Object>)=>({type:'table',label,table})

registerConfig.register({
    label:'容器',
    componentType:"big",
    preview:() => <div id='container' display='true' class="container" style="width:120px;height:60px;font-size:10px;">容器元素</div>,
    render:({son}) => <Container id='container' class="container" style="height:320px;" v-model={son}></Container>,
    key:'container',
    display:true,
    container:true,
})
registerConfig.register({
    label:'文本',
    componentType:"small",
    preview:() => <span id="text" display='false' class="text">Text</span>,
    render:({props,styleContent }) => <span id="text" style={{...styleContent,color:(props as {color:string}).color,fontSize:(props as {size:string}).size }}>{(props as {text:string}).text?(props as {text:string}).text:"Text"}</span>,
    key:'text',
    display:false,
    props: {
        text: createInputProp('文本内容'),
        color: createColorProp('字体颜色'),
        size: createSelectProp('字体大小', [
            { label: '14px', value: '14px' },
            { label: '20px', value: '20px' },
            { label: '24px', value: '24px' }
        ])
    }
})
registerConfig.register({
    label:'按钮',
    componentType:"small",
    preview:() => <ElButton id="button" display='false' class="button">预览按钮</ElButton>,
    render:({ props,styleContent}) => <ElButton id="button" size={(props as {size:string}).size} type={(props as {type:string}).type} style={{...styleContent}}>{(props as {text:String}).text?(props as {text:String}).text:"渲染按钮"}</ElButton>,
    key:'button',
    display:false,
    props: {
        text:createInputProp('按钮内容'),
        type:createSelectProp('按钮类型',[
            {label:'基础',value:'primary'},
            {label:'成功',value:'success'},
            {label:'警告',value:'warning'},
            {label:'危险',value:'danger'},
            {label:'文本',value:'text'},
        ]),
        size:createSelectProp('按钮尺寸',[
            {label:'默认',value:''},
            {label:'中等',value:'medium'},
            {label:'小',value:'small'},
            {label:'极小',value:'mini'}
        ]),

    }
})
registerConfig.register({
    label: '输入框',
    componentType:"small",
    preview: () => <ElInput id="input" display='false' class="input" placeholder="预览输入框"></ElInput>,
    render: ({ model,styleContent}) => <ElInput id="input" placeholder="渲染输入框" {...model.default} style={{...styleContent}}></ElInput>,
    key: 'input',
    display:false,
    model: {
        default: '绑定字段'
    }
})

registerConfig.register({
    label:'链接',
    componentType:"small",
    preview:() => <ElLink style={{width:"50px"}} display='false' >超链接</ElLink>,
    render:({ props,styleContent}) => <ElLink id="link" style={{...styleContent}} href={(props as {href:string}).href} type={(props as {type:string}).type} underline={false}>{(props as {text:String}).text?(props as {text:String}).text:"超链接"}</ElLink>,
    key:'link',
    display:false,
    props: {
        text:createInputProp('链接内容'),
        href:createInputProp('链接地址'),
        type:createSelectProp('链接类型',[
            {label:'基础',value:'primary'},
            {label:'成功',value:'success'},
            {label:'警告',value:'warning'},
            {label:'危险',value:'danger'},
            {label:'文本',value:'info'},
        ])

    }
})

registerConfig.register({
    label: '表单',
    componentType:"big",
    preview: () => (<ElForm display='false'>
        <ElFormItem label="用户名" prop="name">
            <ElInput />
        </ElFormItem>
    </ElForm>),
    render: ({styleContent}) =><DForm id="form" styleContent={styleContent}></DForm>,
    key: 'form',
    display:false,
})

registerConfig.register({
    label: '导航',
    componentType:"big",
    preview: () => <ElMenu display='false' mode="horizontal" default-active="1">
        <ElMenuItem index="1">首页</ElMenuItem>
        <ElMenuItem index="2">更多</ElMenuItem>
    </ElMenu>,
    render: ({props}) => <DMenu id="menu" linkTit={(props as {linkTit:any[]}).linkTit} link={(props as {link:any[]}).link}></DMenu>,
    key: 'menu',
    display:true,
    props:{
        linkTit:createInputProp("导航栏导航数量")
    }
    
})

registerConfig.register({
    label: '轮播图',
    componentType:"big",
    preview: () =><ElCarousel display='true' trigger="click" style={{height:'90px',width:'160px'}}>
        <ElCarouselItem key="1">1</ElCarouselItem>
        <ElCarouselItem key="2">2</ElCarouselItem>
    </ElCarousel>,
    render: ({props}) =><DCarousel id="carousel" num={(props as {num:any[]}).num}></DCarousel>,
    key: 'carousel',
    display:true,
    props:{
        num:createInputProp("轮播图片数量")
    }
})

registerConfig.register({
    label:'卡片',
    componentType:"big",
    preview:() => <ElCard id="container" display='false' shadow="always">预览卡片</ElCard>,
    render:({ props,son}) => <DCard id="card" son={son} text={(props as {text:string}).text} type={(props as {type:string}).type}></DCard>,
    key:'container',
    display:false,
    container:true,
    props: {
        text:createInputProp('卡片内容'),
        type:createSelectProp('阴影类型',[
            {label:'总是',value:'always'},
            {label:'经过',value:'hover'},
            {label:'从不',value:'never'}
        ])

    }
})