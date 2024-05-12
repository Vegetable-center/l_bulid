<template>
<ElMenu :default-active="activeIndex" @Select="handleSelect" mode="horizontal" :style="{height: size.height + 'px', width: '500px' }">
    <el-menu-item index="1">首页</el-menu-item>
    <el-menu-item index="2">Info</el-menu-item>
    <el-menu-item index="3">Info</el-menu-item>
    <el-menu-item index="4">Orders</el-menu-item>
</ElMenu>
</template>
  
<script lang="ts">
import { ElMenu, ElMenuItem, ElSubMenu } from "element-plus";
import { ref } from "vue";

export default {
    props:{
        size:{
            type:Object as ()=>{width:number,height:number},
            required:true,
        }
    },
    setup(){
        const activeIndex = ref('1')
        const handleSelect = (key: any, keyPath: any) => {
            console.log(key, keyPath)
        }
        return {  
            activeIndex,  
            handleSelect  
        };
    },
    components:{
        ElMenu,
        ElMenuItem,
        ElSubMenu
    }
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