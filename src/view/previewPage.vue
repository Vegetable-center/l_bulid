<template>
    <div class="operate">
        <div class="previewbt" @click="back">返回</div>
    </div>
    <previewContent :formData="formData"></previewContent>
</template>

<script lang="ts">
import { reactive } from 'vue';
import previewContent from '../components/previewContent';

export default {
    components:{
        previewContent,
    },
    setup(props, ctx) {
        const formData=reactive({
          username:'张三',
        })

        return{
          formData
        }
    
    },
    methods:{
        back(){
            this.$router.push('/editor');
        }
    }
};
</script>

<style lang="scss">
.operate {
    height: 5%;
    display: flex;
    align-items: center;
    background-color: #eceef2;
    .previewbt{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50%;
        margin-left: 2%;
        border-radius: 15%;
        border: 2px solid #5b5050;
        user-select: none;
        cursor: pointer;
    }
}
</style>