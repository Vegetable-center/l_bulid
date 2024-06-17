<template>
<ElCard :shadow="type" style="width: 300px;height:350px">
    <template #default>
        <Container :modelValue="son" :formData="formData"></Container>
    </template>
</ElCard>
</template>
<script lang="ts">
import type  { EpPropMergeType } from "element-plus/es/utils/vue/props/types";
import { PropType } from "vue";
import Container from "./Container";
import data from '../data.json';
export default {
    props:{
        son:{
            type:Array,
            default:()=>[]
        },
        text:{
            type:String,
            required:true,
            default:()=>"卡片内容"
        },
        type:{
            type:String as PropType<EpPropMergeType<StringConstructor, "always" | "never" | "hover",unknown>>,
            required:true,
            default:()=>"always"
        }
    },
    components:{
        Container
    },
    setup(){
        const {formData} = data;

        return {
            formData
        }
    }
}
</script>