import { defineStore } from "pinia";
import data from '../data.json'
import { update } from "lodash";

// 指的是编辑器的css样式
const {container} = data
// const { blocks } = data
// 指的是在左侧组件库中渲染的组件
const {smallBlocks} = data
const {bigBlocks} = data
//指的是在编辑器中渲染的组件
const {containerBlocks,lastfocus} = data

const userData =defineStore('editorData',{
    state:() => {
        return {
            container,
            smallBlocks,
            bigBlocks,
            containerBlocks,
            lastfocus
        }
    },
    actions: {
        addSon(newData:any){
            (this.lastfocus as any).son.push(newData);
        },
        changeLastFocus(newData: any) {
            // 获取最后一个点击聚焦元素
            this.lastfocus = newData
        },
        // addData(newData:any){
        //     (this.containerBlocks as any[]).push(newData);
        // },
        // clearFocus(){
        //     this.containerBlocks.map(block => {
        //         (block as {focus:boolean}).focus=false;
        //     })
        // },
        update(newData:any){
            this.containerBlocks=newData;
        }
    }
})
const containerData = defineStore('containerData', {
    state: () => {
        return {
            containerBlocks,
            container
        }
    },
    actions: {
        // 这里是添加新数据的方法
        addData(newData: any) {
            (this.containerBlocks as any[]).push(newData);
        },
        addSon(){
            // 多写的这两行代码是为了触发页面的响应式数据，让页面重新渲染
            (this.containerBlocks as any[]).push({});
            (this.containerBlocks as any[]).pop();
        },
        // 这里是清除页面中选中的方法
        clearFocus() {
            this.containerBlocks.map(block => {
                (block as { focus: boolean }).focus = false;
                if((block as { key: string }).key=='container'){
                    const sonArr=(block as {son:Array<any>}).son
                    // son数组有长度说明有子组件，清除子组件中的选中
                    if(sonArr.length){
                        for(let i=0;i<sonArr.length;i++){
                            sonArr[i].focus=false;
                        }
                    }
                }
            })
        },
        // 这里是更新页面组件位置的方法
        update(newData:any){
            this.containerBlocks=newData;
        },
        
        changeData(id: string, newData: Object) {
            // 操作台改变组件的props和model值 所调用的方法
            // console.log("11" + JSON.stringify(newData));
            if (id) {
                // 选中的为组件
                let dataIdx = this.containerBlocks.findIndex((item) => (item as { id: string }).id === id);
                const ctaArr=this.containerBlocks.filter((item) =>(item as {key:string}).key==='container');
                // console.log("22" + JSON.stringify(this.containerBlocks[dataIdx]));
                if(dataIdx==-1){
                    let sonidx:any;
                    for(let item of ctaArr){
                        const idx=(item as {son:Array<any>}).son.findIndex((item) => (item as {id:string}).id ===id);
                        if(idx!==-1){
                            dataIdx=(item as {index:number}).index;
                            sonidx=idx;
                        }
                    }
                    ((this.containerBlocks[dataIdx] as {son:Array<any>}).son[sonidx] as { props: Object }).props = {
                        ...((this.containerBlocks[dataIdx] as {son:Array<any>}).son[sonidx] as { props: Object }).props,
                        ...(newData as { props: Object }).props
                    };
                }
                else{
                    (this.containerBlocks[dataIdx] as { props: Object }).props = {
                        ...(this.containerBlocks[dataIdx] as { props: Object }).props,
                        ...(newData as { props: Object }).props
                    };
    
                    (this.containerBlocks[dataIdx] as { model: Object }).model = (newData as { model: Object }).model ?? {} as Model;
                    // console.log("newDat:"+JSON.stringify((newData as {model:Object}).model));
                }
            }
            else {
                // 选中的是整个页面
                this.container.props = {
                    ...this.container.props,
                    ...(newData as { props: Object }).props
                };
            }

        },
        changeStyle(id: string, newData: Object) {
            // 操作台改变组件的styleContent值 所调用的方法
            // console.log("11" + JSON.stringify(newData));

            if (id) {
                // 选中的为组件
                let dataIdx = this.containerBlocks.findIndex((item) => (item as { id: string }).id === id);
                const ctaArr=this.containerBlocks.filter((item) => (item as {key:string}).key==='container');
                if(dataIdx==-1){
                    let sonidx:any;
                    for(let item of ctaArr){
                        const idx=(item as {son:Array<any>}).son.findIndex((item) => (item as {id:string}).id ===id);
                        if(idx!==-1){
                            dataIdx=(item as {index:number}).index;
                            sonidx=idx;
                        }
                    }
                    ((this.containerBlocks[dataIdx] as {son:Array<any>}).son[sonidx] as { styleContent: Object }).styleContent = {
                        ...((this.containerBlocks[dataIdx] as {son:Array<any>}).son[sonidx] as { styleContent: Object }).styleContent,
                        ...(newData as { styleContent: Object }).styleContent
                    };
                }
                else {
                    // console.log("22" + JSON.stringify(this.containerBlocks[dataIdx]));
                    (this.containerBlocks[dataIdx] as { styleContent: Object }).styleContent = {
                        ...(this.containerBlocks[dataIdx] as { styleContent: Object }).styleContent,
                        ...(newData as { styleContent: Object }).styleContent
                    };
                    // console.log("styleContent:" + JSON.stringify((newData as { styleContent: StyleContent }).styleContent));
                    }
            }
            else {
                // 选中的是整个页面
                this.container.styleContent = {
                    ...this.container.styleContent,
                    ...(newData as { styleContent: Object }).styleContent
                };
            }

        }
    }
})
export { userData, containerData }