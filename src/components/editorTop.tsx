import { defineComponent } from "vue";
import '../declare/declare';
import '../style/editorTop.scss' 
import { useCommand } from "../command/command";

export default defineComponent({
    setup(){
        const commandState = useCommand();
        const buttons =[
            {label:'后退',handler:() => (commandState.commands as {backWard: ()=> void}).backWard()},
            {label:'前进',handler:() => (commandState.commands as {advance: ()=> void}).advance()},
            {label:'清空',handler:() => (commandState.commands as {clear: ()=> void}).clear()},
            {label:'预览',handler:() => (commandState.commands as {preview: ()=> void}).preview()},
        ] 
        // 监听浏览器的键盘事件，ctrl+z和ctrl+y
        window.addEventListener('keydown',(e) => {
            if(e.key=='z'||e.key=='y'){
                let keyString=['ctrl'];
                keyString.push(e.key);
                const key=keyString.join('+');
                commandState.commandArray.forEach(({keyboard,name}) => {
                    if(!keyboard) return;
                    if(keyboard==key){
                        (commandState.commands[name] as Function)();
                        // 取消默认行为，防止触发到浏览器的快捷键
                        e.preventDefault();
                    }
                })
            }
        })
        return ()=> (
            <div class="topContent">
                <div class="logo"></div>
                <div class="topTitle">顶部操作台</div>
                <div class="topButton">
                    {buttons.map(btn => {
                        return <div class="btn" onClick={btn.handler}>{btn.label}</div>
                    })}
                </div>
            </div>
        );
    } 
})