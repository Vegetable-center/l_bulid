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
    preview:() => <span class="text">Text</span>,
    render:() => <span id="text">Text</span>,
    key:'text'
})
registerConfig.register({
    label:'按钮',
    preview:() => <ElButton class="button">预览按钮</ElButton>,
    render:() => <ElButton id="button">渲染按钮</ElButton>,
    key:'button'
})

