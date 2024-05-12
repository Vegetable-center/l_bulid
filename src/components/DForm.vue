<template>
    <ElForm label-width="auto" :style="{height:size.height+'px',width:size.width+'px'}">
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
import { ElForm, ElFormItem, ElInput } from "element-plus";

export default {
    props:{
        size:{
            type:Object as ()=>{width:number,height:number},
            required:true,
        }
    },
    components:{
        ElForm,
        ElFormItem,
        ElInput
    }
}
</script>
    
<style>

</style>