import { defineStore } from "pinia";
import data from '../data.json'

const {container} = data
const {blocks} = data
const {containerBlocks} = data
const userData =defineStore('editorData',{
    state:() => {
        return {
            container,
            blocks,
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
        }
    }
})
export {userData,containerData}