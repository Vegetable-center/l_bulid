<template>
<ElMenu v-if="!hasLink" :default-active="activeIndex" @Select="handleSelect" mode="horizontal" :style="{width: '100%' }">
    <el-menu-item index="1">首页</el-menu-item>
    <el-menu-item index="2">Info</el-menu-item>
    <el-menu-item index="3">Info</el-menu-item>
    <el-menu-item index="4">Orders</el-menu-item>
</ElMenu>
<ElMenu v-else :router="true" :default-active="activeIndex" @Select="handleSelect" mode="horizontal" :style="{width: '500px' }">
    <el-menu-item v-for="(item,index) in linkTit" :index="link[index]" :key="index">{{item}}</el-menu-item>
</ElMenu>
</template>
  
<script lang="ts">
import { computed, ref } from "vue";

export default {
    props:{
        linkTit:{
            type:Array,
            required:true,
            default:()=>[]

        },
        link:{
            type:Array<string>,
            required:true,
            default:()=>[]
        }
    },
    setup(props){
        
        const activeIndex = ref('1')
        const hasLink=computed(()=>props.linkTit.length>0)
        const handleSelect = (key: any, keyPath: any) => {
            console.log(key, keyPath)
        }
        return {  
            hasLink,
            activeIndex,  
            handleSelect  
        };
    },
    
    }
</script>
<style>
.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 100px;
    margin: 0;
    text-align: center;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
</style>