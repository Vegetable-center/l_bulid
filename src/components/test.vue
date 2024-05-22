<template>
    <div>
            <div
                class="item"
                v-for="(item, i) in drag.list"
                :key="item.id"
                :id="i"
                draggable="true"
                @dragstart="dragstart($event, i)"
                @dragenter="dragenter($event, i)"
                @dragend="dragend"
                @dragover="dragover"
               >
                {{ item.name }}
            </div>
    </div>
</template>
<script>
import { reactive } from 'vue'
export default {
  data() {
    return {
      drag: reactive({
        list: [
          { name: 'a', id: 1 },
          { name: 'b', id: 2 },
          { name: 'c', id: 3 },
          { name: 'd', id: 4 },
          { name: 'e', id: 5 },
        ]
      }),
      dragIndex: 0
    }
  },
  methods: {
    dragstart(e, index) {
      e.stopPropagation()
      this.dragIndex = index
      setTimeout(() => {
        e.target.classList.add('moving')
      }, 0)
    },
    dragenter(e, index) {
      e.preventDefault()
      // 拖拽到原位置时不触发
      if (this.dragIndex !== index) {
        console.log("被拖拽的元素"+this.dragIndex)
        console.log("要替换的位置"+index)
        const source = this.drag.list[this.dragIndex];
        this.drag.list.splice(this.dragIndex, 1);
        this.drag.list.splice(index, 0, source);
        // 更新节点位置
        this.dragIndex = index
      }
    },
    dragover(e) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    },
    dragend(e) {
      e.target.classList.remove('moving')
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
	width: 200px;
	height: 40px;
	line-height: 40px;
	// background-color: #f5f6f8;
	background-color: skyblue;
	text-align: center;
	margin: 10px;
	color: #fff;
	font-size: 18px;
}

.container {
  position: relative;
  padding: 0;
}

.moveing {
	opacity: 0;
}
</style>
