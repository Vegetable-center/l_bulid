<template>
    <EditorTop class="nav">这个部分是大的导航栏</EditorTop>
    <div class="editor">
        <EditorLeft class="left"></EditorLeft>
        <EditorRight class="right"></EditorRight>
        <EditorContent class="content"></EditorContent>
    </div>
</template>
  
<script lang="ts">
    import EditorLeft from './editorLeft'
    import EditorRight from './editorRight'
    import EditorTop from './editorTop'
    import EditorContent from './editorContent'
    export default {
        props:{
            modelValue:{
                type:Object,
                require:true,
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
  }
  .right {
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
  }
  .content {
    height: 99%;
    margin-left: 18%;
    margin-right: 18%;
    padding-top: 1%;
  }
</style>
  