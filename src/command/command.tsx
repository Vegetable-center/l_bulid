import { cloneDeep } from "lodash";
import { useRouter } from "vue-router";
import emit from "../declare/Event";
import { containerData} from "../stores";


export function useCommand() {
    const useContainer=containerData();
    let newData:any=null;
    let oldData:any=null;
    emit.on('update',(message) => { newData=message })
    emit.on('record',(message) => { oldData=message })
    
    const state = {
        //前进后退需要的指针索引值
        current:-1,
        // 存放所有的操作指令
        queue:[],
        // 命令和执行功能的一个映射表
        commands:{},
        // 存放所有的指令
        commandArray:[]
    }
    
    const router=useRouter();

    const registry = (command:Command) => {
        (state.commandArray as Array<Command>).push(command);
        (state.commands as Record<string, () => void>)[command.name] = () => {
            const {doFn} = command.execute();
            doFn!();
            if(!command.pushQueue){
                return;
            }
            let {queue,current}=state;
            if(queue.length>0){
                queue=queue.slice(0,current+1);
                state.queue=queue;
            }
            
            if(command.execute().backWard&&command.execute().advance){
                const backWard=command.execute().backWard;
                const advance=command.execute().advance;
                (queue as Array<any>).push({backWard,advance});
            }
            state.current=current+1;
        }
    }

    // 后退指令
    registry({
        name:'backWard',
        keyboard:'ctrl+z',
        pushQueue:false,
        execute() {
            return {
                doFn(){
                    if(state.current==-1) return;
                    let item =state.queue[state.current];
                    if(item){
                        (item as {backWard:() =>void}).backWard&&(item as {backWard:() =>void}).backWard();
                        state.current--;
                    }
                }
            }
        }
    })

    //前进指令
    registry({
        name:'advance',
        keyboard:'ctrl+y',
        pushQueue:false,
        execute() {
            return {
                doFn(){
                    let item=state.queue[state.current+1];
                    if(item){
                        (item as {advance:() =>void}).advance&&(item as {advance:() =>void}).advance();
                        state.current++;
                    } 
                }
            }
        }
    })

    // 拖拽指令
    registry({
        name:'drag',
        pushQueue:true,
        //拖动的初始化函数，当页面中开始拖动的时该函数接收到update的值，就触发drag指令
        init() {
            emit.on('update',() => {
                (state.commands as {drag:()=> void}).drag();
            })
        },
        execute(){
            const oldValue=cloneDeep(oldData);
            const newValue=cloneDeep(newData);
            return {
                doFn(){},
                backWard(){
                    useContainer.containerBlocks=oldValue!;
                    emit.emit('indexChange','back');
                },
                advance() {
                    useContainer.containerBlocks=newValue!;
                    emit.emit('indexChange','advance');
                },
            }
        }
    })

    registry({
        name:'clear',
        pushQueue:false,
        execute() {
            return {
                doFn() {
                    console.log("执行了清空函数");
                    useContainer.containerBlocks=[];
                    emit.emit('indexChange','clear')
                }
            }   
        }
    })

    registry({
        name:'preview',
        pushQueue:false,
        execute() {
            return {
                doFn() {
                    const left=document.querySelector('.left');
                    const right=document.querySelector('.right');
                    (left as HTMLElement).style.left='-15%';
                    (right as HTMLElement).style.right='-15%';
                    console.log("此时执行了预览函数");
                    setTimeout(() => {
                        router.push('/preview')
                    }, 1000);
                }
            }   
        }
    });
    
    // 直接调用初始化函数
    (()=> {
        state.commandArray.forEach(command =>(command as {init:() =>void}).init&&(command as {init:() =>void}).init());
    })();

    return state;
}