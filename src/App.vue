<template>
  <router-view></router-view>
</template>

<script lang="ts">
import data from './data.json'
import { ref } from '@vue/reactivity'
//导入组件 编辑器 editor
import EditorAll from './view/editorAll.vue';
import PreviewPage from './view/previewPage.vue';
// import Test from './components/test.vue'

export default {
    //注册组件
    components:{
        EditorAll,
        // Test,
        PreviewPage
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
  }
  #app {
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
  }
  #app::-webkit-scrollbar {
  width: 6px;
  }
  #app::-webkit-scrollbar-track {
    background: #fff;
    border-radius: 2px;
  }
  #app::-webkit-scrollbar-thumb {
    background: #a4a4a649;
    border-radius: 10px;
  }
  #app::-webkit-scrollbar-thumb:hover {
    background: #56565749;
  }
</style>
