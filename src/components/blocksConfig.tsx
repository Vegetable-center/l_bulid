function createBlock(){
    const componentList:Array<any>=[];
    const componentMap:{[key:string]:Component}={}
    return {
        componentList,
        componentMap,
        register:(component?:Component)=> {
            if(component){
                componentList.push(component);
                componentMap[component.key] = component;
            }
            else {
                console.log("component 没有正确传入")
            }
        }
    }
}

export let registerConfig=createBlock()

registerConfig.register({
    label:'文本',
    preview:() => <span id="text" display='false' class="text">Text</span>,
    render:() => <span id="text">Text</span>,
    key:'text'
})
registerConfig.register({
    label:'按钮',
    preview:() => <ElButton id="button" display='false' class="button">预览按钮</ElButton>,
    render:() => <ElButton id="button">渲染的按钮</ElButton>,
    key:'button'
})
registerConfig.register({
    label:'容器',
    preview:() => <div id='container' display='true' class="container" style="width:120px;height:60px;font-size:10px;">容器元素</div>,
    render:() => <div id='container' class="container" style="height:120px;">渲染的容器</div>,
    key:'container'
})
