import { defineStore } from "pinia";
import data from '../data.json'

const {container} = data
const {blocks} = data
const {containerBlocks,lastfocus} = data
const userData =defineStore('editorData',{
    state:() => {
        return {
            container,
            blocks,
            containerBlocks,
            lastfocus
        }
    },
    actions:{
        changeLastFocus(newData:any){
            // 获取最后一个点击聚焦元素
            this.lastfocus=newData
        }
    }
})
const containerData=defineStore('containerData',{
    state:() => {
        return {
            containerBlocks,
        }
    },
    actions:{
        addData(newData:any){
            (this.containerBlocks as any[]).push(newData);
        },
        clearFocus(){
            this.containerBlocks.map(block => {
                (block as {focus:boolean}).focus=false;
            })
        },
        changeData(id:string,newData:Object){
            // 操作台改变组件的props和model值 所调用的方法
            let dataIdx=this.containerBlocks.findIndex((item)=>(item as {id:string}).id===id);
            (this.containerBlocks[dataIdx] as {props:Object}).props=(newData as {props:Object}).props;
            (this.containerBlocks[dataIdx] as {model:Object}).model=(newData as {model:Object}).model;
        }
    }
})
export {userData,containerData}