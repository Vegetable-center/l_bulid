<template>
<ElCarousel trigger="click" :style="{height:height+'px',width:width+'px'}">
    <ElCarouselItem v-for="item in arr" :key="item">
        <h3 class="small justify-center">{{item}}</h3>
    </ElCarouselItem>
</ElCarousel>
</template>
<script>
import { ElCarousel, ElCarouselItem } from "element-plus";
import { ref } from "vue";

export default {
    props:{
        size:{
            type:Object,
            required:true,
        }
    },
    setup(props){
        const arr=ref([1, 2])
        const width=props.size.width??500;
        const height=props.size.height??200;

        return{
            arr,
            width,
            height
        }
    },
    components:{
        ElCarousel,
        ElCarouselItem
    }
}
</script>