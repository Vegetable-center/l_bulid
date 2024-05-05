<template>
  <EditorAll v-model="stateData"></EditorAll>
</template>

<script lang="ts">
import data from './data.json'
import { ref } from '@vue/reactivity'
//导入组件 编辑器 editor
import EditorAll from './components/editorAll.vue'
export default {
    //注册组件
    components:{
        EditorAll,
    },
    setup(){
      const stateData=ref<Object>(data)
      return {
        stateData,
      }
    }
}
</script>

<style>
  body{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #eceef2;
  }
  #app {
    width: 100%;
    height: 100vh;
  }
</style>
