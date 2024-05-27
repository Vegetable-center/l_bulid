<template>
<ElCard :shadow="type">
{{ text}}
</ElCard>
</template>
<script lang="ts">
import type  { EpPropMergeType } from "element-plus/es/utils/vue/props/types"
import { PropType } from "vue";
export default {
    props:{
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
    
}
</script>