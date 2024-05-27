<template>
<ElCarousel trigger="click" :style="{height:height+'px',width:width+'px'}">
    <!-- 还没传入图片链接时 -->
    <template v-if="NoPic">
      <ElCarouselItem v-for="index in 2" :key="index">  
        <h3 class="small justify-center">{{ index }}</h3>  
      </ElCarouselItem>  
    </template>  
    <!-- 传入图片链接时 -->
    <template v-else>  
      <ElCarouselItem v-for="(item,index) in arr" :key="index">  
        <img :src="item" alt="">  
      </ElCarouselItem>  
    </template>  
</ElCarousel>
</template>
<script>
import { computed, ref } from "vue";

export default {
    props:{
        num:{
            type:Array,
            required:true,
            default: () => []
        }
    },
    setup(props){
        const arr=computed(()=>props.num.length?props.num:[1, 2])
        const width=500;
        const height=200;
        const NoPic=computed(()=>!props.num.length);
        return{
            arr,
            width,
            height,
            NoPic
        }
    }
}
</script>