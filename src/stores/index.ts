import { defineStore } from "pinia";
import data from '../data.json'
import { update } from "lodash";

// 指的是编辑器的css样式
const {container} = data
// 指的是在左侧组件库中渲染的组件
const {smallBlocks} = data
const {bigBlocks} = data
//指的是在编辑器中渲染的组件
const {containerBlocks} = data

const userData =defineStore('editorData',{
    state:() => {
        return {
            container,
            smallBlocks,
            bigBlocks,
            containerBlocks,
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
        update(newData:any){
            this.containerBlocks=newData;
        }
    }
})
export {userData,containerData}