<template>
    <ElForm label-width="auto" :style="{...styleContent}">
        <el-form-item label="用户名" prop="name">
                  <el-input/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input/>
                </el-form-item>
                <!-- <el-form-item v-show={!children}>
                  <div class="dragArea" style={{width:size.width+'px'}}><span>可以将输入框拖拽到此处</span></div>
                </el-form-item> -->
    </ElForm>
</template>
  
<script lang="ts">
import { PropType } from 'vue';


export default {
    props:{
        styleContent:{
          type:Object as PropType<StyleContent>,
          required:true,
          default:()=>{}
        }

    },
}
</script>
    
<style>

</style>