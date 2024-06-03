// 外部模块中的全局声明
declare namespace JSX {
    interface IntrinsicElements {
        // 在这里添加 Vue 内置元素的类型定义
        div: any; // 例如，这里定义了 div 元素的类型为 any
        // 如果需要使用其他内置元素，也可以在这里进行类似的定义
        span:any;
        i:any;
        [x:string]:string;
    }
    interface IntrinsicElements {
    }
}
type Model={
    [modelName:string]:string
}
type Props={}
interface StyleContent{
    display?: string,
    marginTop?:number,
    marginRight?:number,
    marginBottom?:number,
    marginLeft?:number,
    paddingTop?:number,
    paddingRight?:number,
    paddingBottom?:number,
    paddingLeft?:number,
}

//这是命令组件中的命令类
type Command = {
    name: string;
    keyboard?:string;
    pushQueue:boolean;
    init?: () => void;
    execute: () => {
        doFn?: () => void;
        backWard?:() => void;
        advance?:() =>void;
    };
};

//这是对组件对象配置的一个声明
type Component = {
    label: string;
    componentType:string,
    preview: () => JSX.IntrinsicElements;
    render: ({model,props,styleContent,son}:{model?:any,props?:Props,styleContent?:StyleContent,son?:Object}) => JSX.IntrinsicElements;
    key: string,
    display?:boolean,
    model?:Model,
    props?:Props,
};
//左侧组件库中的组件对象的声明
type block = {
    key: string,
    width?:number,
    height?:number,
    focus?:boolean,
    top?:number,
    left?:number,
    props?:Props,
    model?:any,
    display?:boolean,
    index?:number,
    styleContent?:StyleContent,
    son?:Object,
};
declare module 'blockComponet' {
    export default Component;
}
declare module 'block' {
    export default block;
}

// // 这里我们通过扩展全局的 vue 模块来添加 JSX 类型声明
// declare module 'vue' {
//     interface HTMLAttributes {
//       customAttribute?: string;
//     }
// }

//解决DCarousel报错：找不到调用签名的问题
declare module '*.vue' {
    import { defineComponent, HTMLAttributes } from 'vue'
    const component: ReturnType<typeof defineComponent> & {
        customAttribute?: string;
    }
    export default component
}


// declare module '*.vue' {
//     import { ComponentOptions } from 'vue'
//     const componentOptions: ComponentOptions
//     export default componentOptions
// }





// declare module '*.scss' {
//     const styles: { [key: string]: string };
//     export default styles;
// }  
// declare module '*.css' {
//     const styles: { [key: string]: string };
//     export default styles;
// }  
