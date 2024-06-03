import { defineComponent, ref } from "vue";
import { registerConfig as config } from "./blocksConfig";
import { containerData,userData } from "../stores";
import emit from "../declare/Event";

export default defineComponent({
    props:['modelValue'],
    // 在这里实现了拖拽子组件进入容器容器会行进渲染
    setup(props){
        const useStore=userData();
        const useContainer=containerData();

        const sondata=ref(props.modelValue);
        let isPre:string='editor';
        emit.on('preview',(message) => {
            isPre=message;
        })
        // 实现清空页面选中元素的函数
        const clear =() => {
            useContainer.clearFocus();
            useStore.changeLastFocus({})
        }
        const down=(e:MouseEvent,block:block) => {
            if(!block.focus){
                clear();
                block.focus=true;
                useStore.changeLastFocus(block);
            }
            else{
                block.focus=false;
            }
        }
        // 两个鼠标事件做的是，鼠标移动过组件时出现的预选择效果
        const mouseenter = (e:MouseEvent) => {
            if(!(e.target as HTMLElement).classList.contains('componentDisplay')){
                (e.target as HTMLElement).classList.add('preSelect');
            }
        }
        const mouseleave = (e:MouseEvent) => {
            if((e.target as HTMLElement).classList.contains('preSelect')){
                (e.target as HTMLElement).classList.remove('preSelect');
            }
        }
        return {
            sondata,
            down,
            mouseenter,
            mouseleave
        }
    },
    render(){
        const strSondata=JSON.stringify(this.sondata)
        let result:any="渲染的容器";
        if(strSondata!=='[]'){
            result=[];
            this.sondata.forEach((block:any,index:number) => {
                const component=config.componentMap[block.key];
                const renderComponet=component.render({
                    props:(block as {props:Object}).props,
                    styleContent:block.styleContent!,
                    son:block.son,
                });
                const classMO=['comBox'];
                if((block as {focus:boolean}).focus){
                    classMO.push('componentDisplay');
                }
                if(!(block as {display:boolean}).display){
                    classMO.push('inline')
                }
                result.push(<div index={index} onMouseleave={this.mouseleave} onMouseenter={this.mouseenter} class={classMO.join(' ')} onMousedown={(e:MouseEvent) => this.down(e,block)}>
                    {renderComponet}
                </div>)
            })
        }
        return (
            <div>{result}</div>
        )
    }
})