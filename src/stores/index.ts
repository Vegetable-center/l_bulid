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
        addData(newData: any) {
            (this.containerBlocks as any[]).push(newData);
        },
        clearFocus() {
            this.containerBlocks.map(block => {
                (block as { focus: boolean }).focus = false;
            })
        },
        update(newData:any){
            this.containerBlocks=newData;
        },
        changeData(id: string, newData: Object) {
            // 操作台改变组件的props和model值 所调用的方法
            // console.log("11" + JSON.stringify(newData));

            if (id) {
                // 选中的为组件
                let dataIdx = this.containerBlocks.findIndex((item) => (item as { id: string }).id === id);
                // console.log("22" + JSON.stringify(this.containerBlocks[dataIdx]));
                (this.containerBlocks[dataIdx] as { props: Object }).props = {
                    ...(this.containerBlocks[dataIdx] as { props: Object }).props,
                    ...(newData as { props: Object }).props
                };
                console.log("newDat:" + JSON.stringify((newData as { props: Object }).props));

                (this.containerBlocks[dataIdx] as { model: Object }).model = (newData as { model: Object }).model ?? {} as Model;
                // console.log("newDat:"+JSON.stringify((newData as {model:Object}).model));
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
                // console.log("22" + JSON.stringify(this.containerBlocks[dataIdx]));
                (this.containerBlocks[dataIdx] as { styleContent: Object }).styleContent = {
                    ...(this.containerBlocks[dataIdx] as { styleContent: Object }).styleContent,
                    ...(newData as { styleContent: Object }).styleContent
                };
                console.log("styleContent:" + JSON.stringify((newData as { styleContent: StyleContent }).styleContent));
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