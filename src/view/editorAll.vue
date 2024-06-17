<template>
    <div class="background">
      <EditorTop class="nav">这个部分是大的导航栏</EditorTop>
      <div class="editor">
          <EditorLeft class="left"></EditorLeft>
          <EditorRight class="right"></EditorRight>
          <EditorContent class="content" :formData="formData"></EditorContent>
      </div>
    </div>
</template>
  
<script lang="ts">
    import EditorLeft from '../components/editorLeft'
    import EditorRight from '../components/editorRight'
    import EditorTop from '../components/editorTop'
    import EditorContent from '../components/editorContent'
    import { reactive } from 'vue'
    import data from '../data.json'
    export default {
        props:{
            modelValue:{
                type:Object,
                require:true,
            }
        },
        setup() {
          const {formData}=data

          return{
            formData
          }
        
        },
        components:{
          EditorLeft,
          EditorRight,
          EditorTop,
          EditorContent, 
        }
    }
</script>
    
<style>
  .background {
    height: 100%;
    background-color: #eceef2;
    overflow: hidden;
  }
  .nav {
    width: 100%;
    height: 6%;
    background-color: white;
  }
  .editor {
    position: relative;
    height: 93%;
  }
  .left{
    transition: all 1s;   
    position: absolute; 
    left:0;
    top:5px;
    bottom: 0;
    width: 15%;
    height: 100%;
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0px 5px 20px rgba(0,0,0,.3);
    background-color: white;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .left::-webkit-scrollbar {
    width: 3px;
  }
  .left::-webkit-scrollbar-track{
    background-color: #fff;
    border-radius: 2px;
  }
  .left::-webkit-scrollbar-thumb {
    background-color: #a4a4a649;
    border-radius: 10px;
  }
  .right {
    transition: all 1s;
    position: absolute;
    right:0;
    top:5px;
    bottom: 0;
    width: 15%;
    height: 100%;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0px 5px 20px rgba(0,0,0,0.3);
    background-color: white;
    overflow-y: scroll;
  }
.right::-webkit-scrollbar {
  width: 6px;
}
.right::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 2px;
}
.right::-webkit-scrollbar-thumb {
  background: #a4a4a649;
  border-radius: 10px;
}
.right::-webkit-scrollbar-thumb:hover {
  background: #56565749;
}
.content {
  height: 99%;
  margin-left: 18%;
  margin-right: 18%;
  padding-top: 1%;
}
/* 页面中容器组件的样式 */
.container {
  /*display: flex;
  justify-content: center;
  align-items: center;*/
  border: 1px solid #7d7d7d4e;
}
</style>
  