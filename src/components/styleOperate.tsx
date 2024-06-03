import { ElCollapse, ElCollapseItem, ElForm, ElFormItem, ElInput, ElOption, ElSelect } from "element-plus";
import { computed, defineComponent, onMounted, reactive, ref, watch } from "vue";
import { containerData, userData } from "../stores";
import { registerConfig } from "./blocksConfig";
import deepcopy from "deepcopy";

export default defineComponent({
    setup(props, ctx) {
        const activeNames = ref(['1'])
        const focusData = userData()
        // changeStyle和changeData是改变仓库中组件样式和数据的方法
        const { changeData,changeStyle } = containerData()
        // lastfocus是页面中最后选中的组件
        const lastfocus = computed(() => focusData.lastfocus)
        // container是页面中的组件信息
        const container = computed(() => focusData.container)
        const componentMap = registerConfig.componentMap
        // state中的styleContent表示的是组件的内容css样式
        const state = reactive({
            styleData: {
                styleContent:{} as StyleContent
            },
        })
        
        const reset=()=>{
            // 如果页面中没有选中组件，
            if (!lastfocus.value && container.value.styleContent) {
                state.styleData.styleContent = deepcopy(container.value.styleContent)
            }
            else if(lastfocus.value && (lastfocus.value as {styleContent:StyleContent}).styleContent){
                state.styleData.styleContent = deepcopy((lastfocus.value as {styleContent:StyleContent}).styleContent)
            }
            else{
                state.styleData.styleContent = {} as StyleContent
            }
        }

        watch(() =>lastfocus.value, reset, { immediate: true})

        watch(state.styleData,(newValue)=>{
            // 判断有无选中组件，没有则改变的是整个页面
            lastfocus.value?changeStyle((lastfocus.value as { id: string }).id, newValue):changeStyle("", newValue)
        })
        
        return () => {
            let displayContent = []
            let textContent = []
            let bgContent = []
            let positionContent = []
            let borderContent = []

            displayContent.push(<>
                <ElForm>
                    <ElFormItem label="布局模式">
                        <ElSelect v-model={state.styleData.styleContent.display} placeholder="select">
                            <ElOption label="inline" value="inline" />
                            <ElOption label="block" value="block" />
                            <ElOption label="inline-block" value="inline-block" />
                            <ElOption label="flex" value="flex" />
                            <ElOption label="none" value="none" />
                        </ElSelect>
                    </ElFormItem>
                    <ElFormItem>
                        <div className='displayBox'>
                            <div className="marginTop">
                                <span className="marginTips">margin</span>
                                <ElInput v-model={state.styleData.styleContent.marginTop} maxlength='3' placeholder="0"></ElInput>
                            </div>
                            <div className="marginRight">
                                <ElInput v-model={state.styleData.styleContent.marginRight} maxlength='3' placeholder="0"></ElInput>
                            </div>
                            <div className="marginBottom">
                                <ElInput v-model={state.styleData.styleContent.marginBottom} maxlength='3' placeholder="0"></ElInput>
                            </div>
                            <div className="marginLeft">
                                <ElInput v-model={state.styleData.styleContent.marginLeft} maxlength='3' placeholder="0"></ElInput>
                            </div>
                            <div className="paddingTop">
                            <span className="paddingTips">padding</span>
                                <ElInput v-model={state.styleData.styleContent.paddingTop} maxlength='3' placeholder="0"></ElInput>
                            </div>
                            <div className="paddingRight">
                                <ElInput v-model={state.styleData.styleContent.paddingRight} maxlength='3' placeholder="0"></ElInput>
                            </div>
                            <div className="paddingBottom">
                                <ElInput v-model={state.styleData.styleContent.paddingBottom} maxlength='3' placeholder="0"></ElInput>
                            </div>
                            <div className="paddingLeft">
                                <ElInput v-model={state.styleData.styleContent.paddingLeft} maxlength='3' placeholder="0"></ElInput>
                            </div>
                        </div>

                    </ElFormItem>
                </ElForm>
            </>)
            textContent.push(<>
                <ElForm>
                    <ElFormItem label="布局模式">
                        <ElSelect placeholder="select">
                            <ElOption label="inline" value="inline" />
                            <ElOption label="block" value="block" />
                            <ElOption label="inline-block" value="inline-block" />
                            <ElOption label="flex" value="flex" />
                            <ElOption label="none" value="none" />
                        </ElSelect>
                    </ElFormItem>
                </ElForm>
            </>)
            bgContent.push(<>
                <ElForm>
                    <ElFormItem label="布局模式">
                        <ElSelect placeholder="select">
                            <ElOption label="inline" value="inline" />
                            <ElOption label="block" value="block" />
                            <ElOption label="inline-block" value="inline-block" />
                            <ElOption label="flex" value="flex" />
                            <ElOption label="none" value="none" />
                        </ElSelect>
                    </ElFormItem>
                </ElForm>
            </>)
            positionContent.push(<>
                <ElForm>
                    <ElFormItem label="布局模式">
                        <ElSelect placeholder="select">
                            <ElOption label="inline" value="inline" />
                            <ElOption label="block" value="block" />
                            <ElOption label="inline-block" value="inline-block" />
                            <ElOption label="flex" value="flex" />
                            <ElOption label="none" value="none" />
                        </ElSelect>
                    </ElFormItem>
                </ElForm>
            </>)
            borderContent.push(<>
                <ElForm>
                    <ElFormItem label="布局模式">
                        <ElSelect placeholder="select">
                            <ElOption label="inline" value="inline" />
                            <ElOption label="block" value="block" />
                            <ElOption label="inline-block" value="inline-block" />
                            <ElOption label="flex" value="flex" />
                            <ElOption label="none" value="none" />
                        </ElSelect>
                    </ElFormItem>
                </ElForm>
            </>)


            return <ElCollapse v-model={activeNames.value}>
                <ElCollapseItem title="布局" name="1">{displayContent}</ElCollapseItem>
                <ElCollapseItem title="文字" name="2">{textContent}</ElCollapseItem>
                <ElCollapseItem title="背景" name="3">{bgContent}</ElCollapseItem>
                <ElCollapseItem title="位置" name="4">{positionContent}</ElCollapseItem>
                <ElCollapseItem title="边框" name="5">{borderContent}</ElCollapseItem>
            </ElCollapse>
        }
    },

})