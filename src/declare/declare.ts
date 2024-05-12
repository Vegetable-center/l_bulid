// 外部模块中的全局声明
declare namespace JSX {
    interface IntrinsicElements {
        // 在这里添加 Vue 内置元素的类型定义
        div: any; // 例如，这里定义了 div 元素的类型为 any
        // 如果需要使用其他内置元素，也可以在这里进行类似的定义
        span:any;
        i:any;
    }
}
type Size={  //改变组件大小
    width?:number,
    height?:number
}
type Model={
    [modelName:string]:string
}
type Props={}
//这是对组件对象配置的一个声明
type Component = {
    label: string;
    resize?:{
        width?:boolean,
        height?:boolean,
    }
    preview: () => JSX.IntrinsicElements;
    render: ({model,size,props}:{model?:Model,size?:Size,props:Props}) => JSX.IntrinsicElements;
    key: string;
    model?:Model,
    props?:Props
};
//左侧组件库中的组件对象的声明
type block = {
    key: string,
    hasResize?:boolean,
    width?:number,
    height?:number,
    focus?:boolean,
    top?:number,
    left?:number,
    props?:Props
};
declare module 'blockComponet' {
    export default Component;
}
declare module 'block' {
    export default block;
}









// declare module '*.scss' {
//     const styles: { [key: string]: string };
//     export default styles;
// }  
// declare module '*.css' {
//     const styles: { [key: string]: string };
//     export default styles;
// }  
